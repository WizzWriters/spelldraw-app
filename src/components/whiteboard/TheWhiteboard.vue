<script setup lang="ts">
import { usePointerTracker } from '@/common/composables/PointerTracker'
import { usePointerStore } from '@/store/PointerStore'
import { useBoardStore } from '@/store/BoardStore'
import Logger from 'js-logger'
import { onMounted, watch } from 'vue'
import SvgCanvas from './canvas/svg/SvgCanvas.vue'
import TheToolbar from './toolbar/TheToolbar.vue'
import { useRoute, useRouter } from 'vue-router'
import SidebarControl from './sidebar/SidebarControl.vue'
import TheSidebar from './sidebar/TheSidebar.vue'
import { useSidebarStore } from '@/store/SidebarStore'

const logger = Logger.get('MainWhiteboard.vue')

const poinerStore = usePointerStore()
const boardStore = useBoardStore()
const sidebarStore = useSidebarStore()
const pointerPosition = usePointerTracker()

const route = useRoute()
const router = useRouter()

watch(
  pointerPosition,
  (newValue) => {
    poinerStore.setPointerPosition({
      xCoordinate: newValue.xCoordinate,
      yCoordinate: newValue.yCoordinate
    })
  },
  { deep: true }
)

async function handleCanvasReady() {
  logger.debug('Canvas ready indication received!')
}

onMounted(async () => {
  const joined = await boardStore.joinBoard(route.params.id as string)
  if (!joined) {
    router.push({ name: 'not-found' })
  }
})
</script>

<template>
  <div id="the-whiteboard">
    <SvgCanvas @canvas-ready="handleCanvasReady"></SvgCanvas>
    <div id="the-whiteboard-overlay">
      <div class="main-overlay-content">
        <SidebarControl />
        <TheToolbar />
      </div>
      <TheSidebar v-if="sidebarStore.sidebarExpanded" />
    </div>
  </div>
</template>

<style lang="scss">
#the-whiteboard {
  position: relative;
  height: 100%;
}

#the-whiteboard-overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: row;
  width: 100%;
  pointer-events: none;
}

.main-overlay-content {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
