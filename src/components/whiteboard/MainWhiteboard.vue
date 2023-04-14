<script setup lang="ts">
import type { ICanvas } from '@/services/canvas/Canvas'
import Whiteboard from '@/services/whiteboard/Whiteboard'
import Logger from 'js-logger'
import SvgCanvas from './canvas/svg/SvgCanvas.vue'

const logger = Logger.get('MainWhiteboard.vue')

let whiteboard: Whiteboard

async function handleCanvasReady(canvas: ICanvas) {
  logger.debug('Canvas ready indication received!')
  whiteboard = new Whiteboard(canvas)
  await whiteboard.init()
  logger.debug('Whiteboard initialized!')
}
</script>

<template>
  <SvgCanvas @canvas-ready="handleCanvasReady"></SvgCanvas>
</template>
