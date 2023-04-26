<script setup lang="ts">
import Logger from 'js-logger'
import DrawTool from './tools/draw/DrawTool.vue'

const logger = Logger.get('Toolbar')

/* Toolbar implementation will go here, for now we only have one tool */
function handleDrawToolReady() {
  logger.debug('DrawTool ready indication received')
  /* TODO: Emmit toolbar ready, wait for all indications in TheWhiteboard.vue */
}
</script>

<template>
  <DrawTool @draw-tool-ready="handleDrawToolReady"></DrawTool>
</template>
