<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import ToolButton from './ToolButton.vue'
import { useHistoryStore } from '@/store/HistoryStore'
import HistoryService from '@/services/history/HistoryService'

const historyStore = useHistoryStore()

function handleUndoClick() {
  HistoryService.undo()
}
</script>

<template>
  <ToolButton
    id="undo-button"
    name="Undo"
    :is-active="false"
    :is-disabled="!historyStore.isUndoPossible"
    @click="handleUndoClick"
  >
    <FontAwesomeIcon :icon="['fas', 'arrow-rotate-left']" />
  </ToolButton>
</template>

<style lang="scss">
#undo-button {
  order: 3;
}
</style>
