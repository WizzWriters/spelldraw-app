<script setup lang="ts">
import { useToolbarStore } from '@/store/ToolbarStore'
import { onMounted } from 'vue'
import DrawTool from './DrawTool'

const toolbarStore = useToolbarStore()

const emit = defineEmits<{ (e: 'drawToolReady'): void }>()

let drawTool: DrawTool

onMounted(async () => {
  drawTool = new DrawTool()
  await drawTool.init()
  /* Hardcode as active tool for now */
  toolbarStore.activeTool = drawTool
  emit('drawToolReady')
})
</script>

<template>
  <div>
    <!-- Empty for now -->
  </div>
</template>
