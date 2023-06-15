<script setup lang="ts">
import { usePointerTracker } from '@/common/composables/PointerTracker'
import { usePointerStore } from '@/store/PointerStore'
import { useBoardStore } from '@/store/BoardStore'
import Logger from 'js-logger'
import { onMounted, watch } from 'vue'
import SvgCanvas from './canvas/svg/SvgCanvas.vue'
import TheToolbar from './toolbar/TheToolbar.vue'
import { useRoute, useRouter } from 'vue-router'

const logger = Logger.get('MainWhiteboard.vue')

const poinerStore = usePointerStore()
const boardStore = useBoardStore()
const pointerPosition = usePointerTracker()

const route = useRoute()
const router = useRouter()

watch(
  pointerPosition,
  (newValue) => {
    poinerStore.setPointerPosition({
      xCoordinate: newValue.xCoordinate,
      yCoordinate: newValue.yCoordinate
    })
  },
  { deep: true }
)

async function handleCanvasReady() {
  logger.debug('Canvas ready indication received!')
}

onMounted(async () => {
  const joined = await boardStore.joinBoard(route.params.id as string)
  if (!joined) {
    router.push({ name: 'not-found' })
  }
})
</script>

<template>
  <SvgCanvas @canvas-ready="handleCanvasReady"></SvgCanvas>
  <TheToolbar></TheToolbar>
</template>
