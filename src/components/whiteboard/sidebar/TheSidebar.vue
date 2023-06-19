<script setup lang="ts">
import { ESidebarContent, useSidebarStore } from '@/store/SidebarStore'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import ShareSidebar from './ShareSidebar.vue'
import ColorSidebar from './ColorSidebar.vue'

const sidebarStore = useSidebarStore()

function collapseSidebar() {
  sidebarStore.collapseSidebar()
}
</script>

<template>
  <div id="sidebar" class="p-5 box">
    <div
      class="is-flex is-align-items-center is-size-3 is-justify-content-space-between"
    >
      <h2 class="is-size-3">{{ sidebarStore.sidebarContent }}</h2>
      <FontAwesomeIcon
        :icon="['far', 'circle-xmark']"
        class="closing-icon"
        @click="collapseSidebar()"
      />
    </div>
    <ShareSidebar v-if="sidebarStore.sidebarContent == ESidebarContent.SHARE" />
    <ColorSidebar
      v-else-if="sidebarStore.sidebarContent == ESidebarContent.COLOR"
    />
  </div>
</template>

<style lang="scss">
.closing-icon {
  cursor: pointer;
}
</style>
