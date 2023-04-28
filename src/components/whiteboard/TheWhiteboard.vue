<script setup lang="ts">
import { usePointerTracker } from '@/common/composables/PointerTracker'
import { usePointerStore } from '@/store/PointerStore'
import Logger from 'js-logger'
import { watch } from 'vue'
import SvgCanvas from './canvas/svg/SvgCanvas.vue'
import ShapeCorrection from './ShapeCorrection.vue'
import TheToolbar from './toolbar/TheToolbar.vue'

const logger = Logger.get('MainWhiteboard.vue')

const poinerStore = usePointerStore()
const pointerPosition = usePointerTracker()
watch(
  pointerPosition,
  (newValue) => {
    poinerStore.pointerPosition = {
      xCoordinate: newValue.xCoordinate,
      yCoordinate: newValue.yCoordinate
    }
  },
  { deep: true }
)

async function handleCanvasReady() {
  logger.debug('Canvas ready indication received!')
}
</script>

<template>
  <SvgCanvas @canvas-ready="handleCanvasReady"></SvgCanvas>
  <TheToolbar></TheToolbar>
  <ShapeCorrection></ShapeCorrection>
</template>
