<script setup lang="ts">
const props = defineProps<{
  name: string
  isActive: Boolean
  isDisabled: Boolean
}>()
</script>

<template>
  <button
    class="tool-button button is-medium has-text-dark is-rounded"
    :title="props.name"
    :class="{ 'is-focused': props.isActive }"
    :disabled="props.isDisabled == true"
  >
    <slot></slot>
  </button>
</template>
