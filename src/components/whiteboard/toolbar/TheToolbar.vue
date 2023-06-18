<script setup lang="ts">
// import Logger from 'js-logger'
import { computed, markRaw, ref } from 'vue'
import DrawTool from './tools/DrawTool.vue'
import EraserTool from './tools/EraserTool.vue'
import SelectTool from './tools/SelectTool.vue'

// const logger = Logger.get('Toolbar')
const tools = ref([
  { isActive: true, component: markRaw(DrawTool) },
  { isActive: false, component: markRaw(EraserTool) },
  { isActive: false, component: markRaw(SelectTool) }
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
  <div
    class="toolbar is-flex is-flex-direction-row is-justify-content-center mb-4"
  >
    <div class="tools is-flex">
      <component
        v-for="(tool, idx) in tools"
        :key="idx"
        :is="tool.component"
        :is-active="tool.isActive"
        @click="toggleActive(idx)"
      />
    </div>
  </div>
</template>

<style lang="scss">
.toolbar {
  bottom: 0;
  width: 100%;
  pointer-events: none;
}

.tools {
  gap: 0.2rem;
}
</style>
