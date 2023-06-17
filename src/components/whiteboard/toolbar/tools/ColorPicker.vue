<script setup lang="ts">
import ToolButton from './ToolButton.vue'

const props = defineProps<{
  isActive: Boolean
}>()
</script>

<template>
  <ToolButton name="Color picker" :is-active="props.isActive">
    <div id="picker">Test</div>
    <FontAwesomeIcon :icon="['fas', 'palette']" />
  </ToolButton>
</template>
