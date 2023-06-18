<script setup lang="ts">
import { hslColorToString } from '@/helpers/Svg'
import { ConnectedUser, useBoardStore } from '@/store/BoardStore'
import { computed, ref } from 'vue'

const baordStore = useBoardStore()
const boardUrl = computed(() => window.location.href)
const copied = ref(false)

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
</script>

<template>
  <div>
    <div>
      <p class="mt-2">Anyone with this link can join:</p>
      <input class="input mt-1" type="text" :value="boardUrl" readonly />
      <button
        title="Copy to clipboard"
        id="copy-button"
        class="button mt-2"
        @click="copyToClipboard()"
      >
        <span v-if="!copied">Copy</span>
        <span v-else>Copied!</span>
      </button>
    </div>
    <div>
      <p class="is-size-5 my-2">Connected users:</p>
      <div
        class="has-text-weight-semibold is-flex is-justify-content-space-between"
      >
        <span>You</span>
        <FontAwesomeIcon icon="fa-user" />
      </div>
      <div
        v-for="(user, idx) of baordStore.connectedUsers"
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
