<script setup lang="ts">
import Logger from 'js-logger'
import SvgCanvas from './canvas/svg/SvgCanvas.vue'
import TheToolbar from './toolbar/TheToolbar.vue'

const logger = Logger.get('MainWhiteboard.vue')

async function handleCanvasReady() {
  logger.debug('Canvas ready indication received!')
}
</script>

<template>
  <SvgCanvas @canvas-ready="handleCanvasReady"></SvgCanvas>
  <TheToolbar></TheToolbar>
</template>
