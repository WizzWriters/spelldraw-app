<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Logger from 'js-logger'
import { HTMLCanvas } from '../html/HtmlCanvas'
import type { ICanvas } from '../Canvas'

const logger = Logger.get('WhiteboardCanvas.vue')
const canvasElementRef = ref<HTMLCanvasElement | null>(null)
const canvasWrapperElementRef = ref<HTMLDivElement | null>(null)

let canvas: HTMLCanvas

const emit = defineEmits<{
  (e: 'canvasReady', canvas: ICanvas): void
}>()

function initializeComponent() {
  let canvasElement = canvasElementRef.value
  let wrapperElement = canvasWrapperElementRef.value
  if (!canvasElement || !wrapperElement) {
    logger.error('Canvas or canvas wrapper element not present!')
    return
  }

  canvas = initializeCanvas(canvasElement, wrapperElement)
  logger.debug('Canvas ready!')
  emit('canvasReady', canvas)
}

function initializeCanvas(
  canvasElement: HTMLCanvasElement,
  wrapperElement: HTMLDivElement
): HTMLCanvas {
  let canvas = new HTMLCanvas(canvasElement)

  function resizeCallback() {
    const displayedWidth = wrapperElement!.clientWidth
    const displayedHeight = wrapperElement!.clientHeight
    canvas.resize(displayedWidth, displayedHeight)
  }

  resizeCallback()
  new ResizeObserver(resizeCallback).observe(wrapperElement)
  return canvas
}

onMounted(initializeComponent)
</script>

<template>
  <div id="canvas-wrapper" ref="canvasWrapperElementRef">
    <canvas id="main-canvas" ref="canvasElementRef"></canvas>
  </div>
</template>

<style scoped lang="scss">
#canvas-wrapper {
  display: flex;
  flex: 1 1 auto;
}

#main-canvas {
  touch-action: none;
}
</style>
