<script setup lang="ts">
import { ESidebarContent, useSidebarStore } from '@/store/SidebarStore'
import ToolButton from './ToolButton.vue'
import { computed } from 'vue'
import { onMounted } from 'vue'
import KeyboardService from '@/services/keyboard/KeyboardService'

const sidebarStore = useSidebarStore()
const colorPickerActive = computed(() => {
  return (
    sidebarStore.sidebarExpanded &&
    sidebarStore.sidebarContent == ESidebarContent.COLOR
  )
})

function toggleColorPicker() {
  if (colorPickerActive.value) sidebarStore.collapseSidebar()
  else sidebarStore.expandSidebar(ESidebarContent.COLOR)
}

onMounted(() => {
  const canvasKeyboard = KeyboardService.get('canvas')
  canvasKeyboard.registerCallback(['c'], toggleColorPicker)
  canvasKeyboard.registerCallback(['C'], toggleColorPicker)
})
</script>

<template>
  <div id="color-picker">
    <ToolButton
      id="picker-icon"
      name="Color picker"
      :is-active="colorPickerActive"
      :is-disabled="false"
      @click="toggleColorPicker()"
    >
      <FontAwesomeIcon id="tool-icon" :icon="['fas', 'palette']" />
    </ToolButton>
  </div>
</template>

<style lang="scss">
#color-picker {
  order: 0;
}
</style>
