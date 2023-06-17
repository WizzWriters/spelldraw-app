<script setup lang="ts">
import { ESidebarContent, useSidebarStore } from '@/store/SidebarStore'
import ToolButton from './ToolButton.vue'

const sidebarStore = useSidebarStore()

function showColorPicker() {
  sidebarStore.expandSidebar(ESidebarContent.COLOR)
}
</script>

<template>
  <div id="color-picker">
    <ToolButton
      id="picker-icon"
      name="Color picker"
      :is-active="false"
      @click="showColorPicker()"
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
