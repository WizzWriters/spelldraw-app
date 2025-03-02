<script setup lang="ts">
// import Logger from 'js-logger'
import { computed, markRaw, ref } from 'vue'
import ColorPicker from './tools/ColorPicker.vue'
import DrawTool from './tools/DrawTool.vue'
import EraserTool from './tools/EraserTool.vue'
import MoveTool from './tools/MoveTool.vue'
import SelectTool from './tools/SelectTool.vue'
import UndoButton from './tools/UndoButton.vue'
import RedoButton from './tools/RedoButton.vue'
import { onMounted } from 'vue'
import KeyboardService from '@/services/keyboard/KeyboardService'

// const logger = Logger.get('Toolbar')
enum ECanvasTool {
  DRAW,
  ERASER,
  SELECT,
  MOVE
}

const tools = ref([
  {
    type: ECanvasTool.DRAW,
    isActive: true,
    isDisabled: false,
    component: markRaw(DrawTool)
  },
  {
    type: ECanvasTool.ERASER,
    isActive: false,
    isDisabled: false,
    component: markRaw(EraserTool)
  },
  {
    type: ECanvasTool.SELECT,
    isActive: false,
    isDisabled: false,
    component: markRaw(SelectTool)
  },
  {
    type: ECanvasTool.MOVE,
    isActive: false,
    isDisabled: false,
    component: markRaw(MoveTool)
  }
])

const activeTool = computed(() => {
  return tools.value.filter((tool) => tool.isActive)[0]
})

function toggleActive(idx: number) {
  activeTool.value.isActive = false
  tools.value[idx].isActive = true
}

onMounted(() => {
  const activateTool = (tool: ECanvasTool) => () => {
    for (let idx = 0; idx < tools.value.length; idx++) {
      if (tools.value[idx].type != tool) continue
      toggleActive(idx)
    }
  }

  const canvasKeyboard = KeyboardService.get('canvas')
  const shortcuts: Array<[string, ECanvasTool]> = [
    ['d', ECanvasTool.DRAW],
    ['D', ECanvasTool.DRAW],
    ['e', ECanvasTool.ERASER],
    ['E', ECanvasTool.ERASER],
    ['s', ECanvasTool.SELECT],
    ['S', ECanvasTool.SELECT],
    ['m', ECanvasTool.MOVE],
    ['M', ECanvasTool.MOVE]
  ]

  for (const [key, tool] of shortcuts) {
    canvasKeyboard.registerCallback([key], activateTool(tool))
  }
})
</script>

<template>
  <div id="toolbar">
    <div class="tools">
      <component
        v-for="(tool, idx) in tools"
        :key="idx"
        :is="tool.component"
        :isActive="tool.isActive"
        :isDisabled="tool.isDisabled"
        @click="toggleActive(idx)"
      />
      <ColorPicker />
      <UndoButton />
      <RedoButton />
    </div>
  </div>
</template>

<style lang="scss"></style>
