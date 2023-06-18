import { defineStore } from 'pinia'
import { type Ref, ref } from 'vue'

export enum ESidebarContent {
  SHARE = 'Share'
}

export const useSidebarStore = defineStore('sidebar', () => {
  const sidebarExpanded: Ref<Boolean> = ref(false)
  const sidebarContent: Ref<ESidebarContent> = ref(ESidebarContent.SHARE)

  function expandSidebar(contentType: ESidebarContent) {
    sidebarExpanded.value = true
    sidebarContent.value = contentType
  }

  function collapseSidebar() {
    sidebarExpanded.value = false
  }

  return { sidebarContent, sidebarExpanded, expandSidebar, collapseSidebar }
})
