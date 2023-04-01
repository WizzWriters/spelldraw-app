<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Logger from 'js-logger'
import { HTMLCanvas } from './Canvas'

const logger = Logger.get('MainCanvas.vue')
const canvasRef = ref<HTMLCanvasElement | null>(null)
const canvasWrapperRef = ref<HTMLDivElement | null>(null)

let canvas: HTMLCanvas

function initializeCanvas() {
  let canvasElement = canvasRef.value
  let wrapperElement = canvasWrapperRef.value
  if (!canvasElement || !wrapperElement) {
    logger.error('Canvas or canvas wrapper element not present!')
    return
  }

  canvas = new HTMLCanvas(canvasElement)

  function resizeCallback() {
    const displayedWidth = wrapperElement!.clientWidth
    const displayedHeight = wrapperElement!.clientHeight
    canvas.resize(displayedWidth, displayedHeight)
  }

  new ResizeObserver(resizeCallback).observe(wrapperElement)
}

onMounted(initializeCanvas)
</script>

<template>
  <div id="canvas-wrapper" ref="canvasWrapperRef">
    <canvas id="main-canvas" ref="canvasRef"></canvas>
  </div>
</template>

<style scoped lang="scss">
#canvas-wrapper {
  display: flex;
}
</style>
