<script setup lang="ts">
import { useBoardStore } from '@/store/BoardStore'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(async () => {
  const boardStore = useBoardStore()
  await boardStore.createBoard()
  router.push({ name: 'board', params: { id: boardStore.boardId } })
})
</script>

<template>
  <div class="pageloader is-active">
    <span class="title">Loading...</span>
  </div>
</template>

<style scoped lang="scss">
.pageloader {
  bottom: unset;
  top: unset;
  left: unset;
  right: unset;
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
