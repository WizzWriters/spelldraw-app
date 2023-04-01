<script setup lang="ts">
import type { Canvas } from '@/models/Canvas'
import Whiteboard from '@/models/Whiteboard'
import Logger from 'js-logger'
import WhiteboardCanvas from './canvas/WhiteboardCanvas.vue'

const logger = Logger.get('MainWhiteboard.vue')

function handleCanvasReady(canvas: Canvas) {
  logger.debug('Canvas ready indication received!')
  new Whiteboard(canvas)
  logger.debug('Whiteboard initialized!')
}
</script>

<template>
  <WhiteboardCanvas @canvas-ready="handleCanvasReady"></WhiteboardCanvas>
</template>
