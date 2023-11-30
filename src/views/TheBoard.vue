<script setup lang="ts">
import { usePointerTracker } from '@/common/composables/PointerTracker'
import { usePointerStore } from '@/store/PointerStore'
import { useBoardStore } from '@/store/BoardStore'
import Logger from 'js-logger'
import { computed, onMounted, reactive, watch } from 'vue'
import SvgCanvas from '@/components/whiteboard/canvas/svg/SvgCanvas.vue'
import TheToolbar from '@/components/whiteboard/toolbar/TheToolbar.vue'
import { useRoute, useRouter } from 'vue-router'
import SidebarControl from '@/components/whiteboard/sidebar/SidebarControl.vue'
import TheSidebar from '@/components/whiteboard/sidebar/TheSidebar.vue'
import { useSidebarStore } from '@/store/SidebarStore'
import PageLoader from '@/components/loading/PageLoader.vue'
import TheMagic from '@/components/whiteboard/magic/TheMagic.vue'
import KeyboardService from '@/services/keyboard/KeyboardService'

const logger = Logger.get('MainWhiteboard.vue')

const poinerStore = usePointerStore()
const boardStore = useBoardStore()
const sidebarStore = useSidebarStore()
const pointerPosition = usePointerTracker()

const route = useRoute()
const router = useRouter()

const initState = reactive({
  boardReady: false,
  canvasReady: false,
  magicReady: false
})

const ready = computed(() => {
  return initState.canvasReady && initState.boardReady && initState.magicReady
})

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

function handleCanvasReady() {
  initState.canvasReady = true
  logger.debug('Canvas ready indication received!')
  KeyboardService.activateKeyspace('canvas')
}

function handleMagicReady() {
  initState.magicReady = true
  logger.debug('Magic ready indication received!')
}

onMounted(async () => {
  const joined = await boardStore.joinBoard(route.params.id as string)
  if (!joined) {
    router.push({ name: 'not-found' })
    return
  }

  logger.debug(`Joined the board id=${route.params.id}`)
  initState.boardReady = true
})
</script>

<template>
  <PageLoader v-if="!ready">Loading board...</PageLoader>
  <div id="the-whiteboard">
    <SvgCanvas @canvas-ready="handleCanvasReady"></SvgCanvas>
    <div id="the-whiteboard-overlay">
      <div id="main-overlay-content">
        <SidebarControl />
        <TheToolbar />
      </div>
      <TheSidebar v-if="sidebarStore.sidebarExpanded" />
    </div>
    <TheMagic @magic-ready="handleMagicReady"></TheMagic>
  </div>
</template>

<style lang="scss">
#the-whiteboard {
  position: relative;
  height: 100%;
}
</style>
