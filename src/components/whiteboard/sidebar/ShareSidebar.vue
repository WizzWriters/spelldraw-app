<script setup lang="ts">
import { hslColorToString } from '@/helpers/Svg'
import { ConnectedUser, useBoardStore } from '@/store/BoardStore'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const boardStore = useBoardStore()
const boardUrl = ref('')
const copied = ref(false)
const creatingNewBoard = ref(false)

function resetCopied() {
  copied.value = false
}

function getUserStyleString(user: ConnectedUser) {
  return `color: ${hslColorToString(user.color)};`
}

function copyToClipboard() {
  copied.value = true
  navigator.clipboard.writeText(boardUrl.value)
  setTimeout(resetCopied, 1000)
}

async function publishBoard() {
  creatingNewBoard.value = true
  await boardStore.publishBoard()
  await router.push({ name: 'board', params: { boardId: boardStore.boardId } })
  boardUrl.value = window.location.origin + router.currentRoute.value.path
}
</script>

<template>
  <div>
    <div v-if="boardStore.localBoard">
      <p class="mt-2">
        You are currently working on your private board. Share it with others by
        clicking the button below.
      </p>
      <button
        title="Share!"
        :class="['button', 'mt-4', creatingNewBoard ? 'is-loading' : '']"
        @click="publishBoard()"
      >
        Share!
      </button>
    </div>

    <div v-if="!boardStore.localBoard">
      <p class="mt-2">Anyone with this link can join:</p>
      <input class="input mt-1" type="text" :value="boardUrl" readonly />
      <button
        title="Copy to clipboard"
        class="button mt-2"
        @click="copyToClipboard()"
      >
        <span v-if="!copied">Copy</span>
        <span v-else>Copied!</span>
      </button>
    </div>

    <div v-if="!boardStore.localBoard">
      <p class="is-size-5 my-2">Connected users:</p>
      <div
        class="has-text-weight-semibold is-flex is-justify-content-space-between"
      >
        <span>You</span>
        <FontAwesomeIcon icon="fa-user" />
      </div>
      <div
        v-for="(user, idx) of boardStore.connectedUsers"
        :key="idx"
        class="has-text-weight-semibold is-flex is-justify-content-space-between"
        :style="getUserStyleString(user)"
      >
        <span>Unknown user</span>
        <FontAwesomeIcon icon="fa-user" />
      </div>
    </div>
  </div>
</template>
