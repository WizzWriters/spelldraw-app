<script setup lang="ts">
import Logger from 'js-logger'
import SvgCanvas from './canvas/svg/SvgCanvas.vue'

const logger = Logger.get('MainWhiteboard.vue')

async function handleCanvasReady() {
  logger.debug('Canvas ready indication received!')
}
</script>

<template>
  <SvgCanvas @canvas-ready="handleCanvasReady"></SvgCanvas>
</template>
