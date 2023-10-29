<script setup lang="ts">
import { useBoardStore } from '@/store/BoardStore'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PageLoader from '@/components/loading/PageLoader.vue'

const router = useRouter()

onMounted(async () => {
  const boardStore = useBoardStore()
  await boardStore.createBoard()
  router.push({ name: 'board', params: { id: boardStore.boardId } })
})
</script>

<template>
  <PageLoader> Prepering the board... </PageLoader>
</template>
