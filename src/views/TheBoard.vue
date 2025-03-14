<script setup lang="ts">
import { usePointerTracker } from '@/common/composables/PointerTracker'
import { usePointerStore } from '@/store/PointerStore'
import Logger from 'js-logger'
import { computed, onMounted, reactive, watch } from 'vue'
import TheLogo from '@/components/logo/TheLogo.vue'
import SvgCanvas from '@/components/whiteboard/canvas/svg/SvgCanvas.vue'
import TheToolbar from '@/components/whiteboard/toolbar/TheToolbar.vue'
import { useRoute, useRouter } from 'vue-router'
import SidebarControl from '@/components/whiteboard/sidebar/SidebarControl.vue'
import TheSidebar from '@/components/whiteboard/sidebar/TheSidebar.vue'
import ConnectionModal from '@/components/connection/ConnectionModal.vue'
import { useSidebarStore } from '@/store/SidebarStore'
import PageLoader from '@/components/loading/PageLoader.vue'
import TheMagic from '@/components/whiteboard/magic/TheMagic.vue'
import KeyboardService from '@/services/keyboard/KeyboardService'
import BoardService from '@/services/board/BoardService'

const logger = Logger.get('MainWhiteboard.vue')

const poinerStore = usePointerStore()
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

const loadingPrompt = computed(() => {
  if (!initState.canvasReady) return 'Preparing the canvas...'

  if (!initState.boardReady) return 'Loading the board...'

  if (!initState.magicReady) return 'Initializing AI models...'

  return 'Preparing the board....'
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
  const boardService = new BoardService()

  if (router.currentRoute.value.name == 'root') {
    /* For now we support only one local board, so load the one with id = 1 */
    await boardService.loadLocalBoard(1)
    initState.boardReady = true
    return
  }

  const boardId = route.params.boardId as string
  const joined = await boardService.joinRemoteBoard(boardId)
  if (!joined) {
    router.push({ name: 'not-found' })
    return
  }
  initState.boardReady = true
})
</script>

<template>
  <PageLoader v-if="!ready">
    {{ loadingPrompt }}
  </PageLoader>
  <div id="the-whiteboard">
    <SvgCanvas @canvas-ready="handleCanvasReady"></SvgCanvas>
    <ConnectionModal />
    <div id="the-whiteboard-overlay">
      <div id="the-main-overlay">
        <div class="is-flex is-justify-content-space-between">
          <TheLogo />
          <SidebarControl />
        </div>
        <div id="toolbar-overlay">
          <TheToolbar />
        </div>
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
