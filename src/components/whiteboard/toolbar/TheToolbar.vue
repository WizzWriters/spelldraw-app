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

// const logger = Logger.get('Toolbar')
const tools = ref([
  { isActive: true, isDisabled: false, component: markRaw(DrawTool) },
  { isActive: false, isDisabled: false, component: markRaw(EraserTool) },
  { isActive: false, isDisabled: false, component: markRaw(SelectTool) },
  { isActive: false, isDisabled: false, component: markRaw(MoveTool) }
])

const activeTool = computed(() => {
  return tools.value.filter((tool) => tool.isActive)[0]
})

function toggleActive(idx: number) {
  activeTool.value.isActive = false
  tools.value[idx].isActive = true
}
</script>

<template>
  <div id="toolbar">
    <div class="tools">
      <component
        v-for="(tool, idx) in tools"
        :key="idx"
        :is="tool.component"
        :is-active="tool.isActive"
        :is-disabled="tool.isDisabled"
        @click="toggleActive(idx)"
      />
      <ColorPicker />
      <UndoButton />
      <RedoButton />
    </div>
  </div>
</template>

<style lang="scss"></style>
