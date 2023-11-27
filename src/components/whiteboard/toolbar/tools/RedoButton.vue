<script setup lang="ts">
import { useHistoryStore } from '@/store/history/HistoryStore'
import ToolButton from './ToolButton.vue'
import HistoryService from '@/services/history/HistoryService'

const historyStore = useHistoryStore()

function handleUndoClick() {
  HistoryService.redo()
}
</script>

<template>
  <ToolButton
    id="redo-button"
    name="Redo"
    :is-active="false"
    :is-disabled="!historyStore.isRedoPossible"
    @click="handleUndoClick"
  >
    <FontAwesomeIcon :icon="['fas', 'arrow-rotate-right']" />
  </ToolButton>
</template>

<style lang="scss">
#redo-button {
  order: 4;
}
</style>
