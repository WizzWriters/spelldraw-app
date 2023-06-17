<script setup lang="ts">
const props = defineProps<{
  name: string
  isActive: Boolean
}>()
</script>

<template>
  <div
    class="tool-button button is-medium has-text-dark is-rounded"
    :title="props.name"
    :class="{ 'is-focused': props.isActive }"
  >
    <slot></slot>
  </div>
</template>
