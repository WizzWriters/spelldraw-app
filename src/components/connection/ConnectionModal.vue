<script setup lang="ts">
import { ref, watch } from 'vue'
import { useBoardStore } from '@/store/BoardStore'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import BoardService from '@/services/board/BoardService'

const modalShown = ref(false)
const boardStore = useBoardStore()
const router = useRouter()

const { hostDisconnected } = storeToRefs(boardStore)
watch(hostDisconnected, (nextState, previousState) => {
  if (nextState == previousState) return

  if (nextState) modalShown.value = true
})

function closeModal() {
  boardStore.setLocalBoard()
  modalShown.value = false
}

async function leaveBoard() {
  const boardService = new BoardService()
  /* For now we only support single local board, so load the one with id = 1 */
  await boardService.loadLocalBoard(1)
  modalShown.value = false
  router.push({ name: 'root' })
}
</script>

<template>
  <div :class="['modal', modalShown ? 'is-active' : '']">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="card">
        <div class="card-content">
          <p class="subtitle mb-2 has-text-danger">
            The owner has stopped sharing this board.
          </p>
          <p>
            You can continue to edit this board in offline mode, but none of the
            edits will be saved or shared.
          </p>
        </div>
        <footer class="card-footer">
          <a class="card-footer-item" @click="leaveBoard">Leave</a>
          <a class="card-footer-item" @click="closeModal">Keep editing</a>
        </footer>
      </div>
    </div>
  </div>
</template>
