<script setup lang="ts">
import { ESidebarContent, useSidebarStore } from '@/store/SidebarStore'
import type { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const sidebarStore = useSidebarStore()

const expandSidebar = (contentType: ESidebarContent) => {
  sidebarStore.expandSidebar(contentType)
}
</script>

<template>
  <div class="is-flex is-justify-content-end p-2">
    <button
      title="Share"
      class="sidebar-control-button button is-outlined is-rounded"
      @click="expandSidebar(ESidebarContent.SHARE)"
    >
      <FontAwesomeIcon icon="fa-share-nodes"></FontAwesomeIcon>
    </button>
  </div>
</template>

<style lang="scss">
.sidebar-control-button {
  pointer-events: auto;
}
</style>
