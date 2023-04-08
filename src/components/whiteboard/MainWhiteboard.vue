<script setup lang="ts">
import type { ICanvas } from './canvas/Canvas'
import Whiteboard from './Whiteboard'
import Logger from 'js-logger'
import HtmlCanvas from './canvas/html/HtmlCanvas.vue'

const logger = Logger.get('MainWhiteboard.vue')

function handleCanvasReady(canvas: ICanvas) {
  logger.debug('Canvas ready indication received!')
  new Whiteboard(canvas)
  logger.debug('Whiteboard initialized!')
}
</script>

<template>
  <HtmlCanvas @canvas-ready="handleCanvasReady"></HtmlCanvas>
</template>
