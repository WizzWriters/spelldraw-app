<script setup lang="ts">
const props = defineProps<{
  isActive: Boolean
}>()
</script>

<template>
  <button
    class="tool-button button is-medium has-text-dark is-rounded"
    :class="{ 'is-focused': props.isActive }"
  >
    <slot></slot>
  </button>
</template>
