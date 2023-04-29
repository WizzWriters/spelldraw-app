<script setup lang="ts">
import Logger from 'js-logger'
import { ref, onMounted, computed } from 'vue'
import { usePointerTracker } from '@/common/composables/PointerTracker'
import { useCanvasStore } from '@/store/CanvasStore'
import SvgShapeDrawer from './SvgShapeDrawer.vue'
import SvgPolylineShape from './SvgPolylineShape.vue'
import lodash from 'lodash'
import { useToolbarStore } from '@/store/ToolbarStore'
import { EPointerEvent } from '@/common/definitions/Pointer'
import { getPositionOnCanvas } from '@/helpers/CanvasHelper'

type CanvasElement = HTMLElement & SVGSVGElement

const logger = Logger.get('SvgCanvas.vue')
const canvasElementRef = ref<CanvasElement | null>(null)
const canvasWrapperElementRef = ref<HTMLDivElement | null>(null)

const canvasWidth = ref<number>(0)
const canvasHeight = ref<number>(0)

const emit = defineEmits<{ (e: 'canvasReady'): void }>()

const canvasStore = useCanvasStore()
const toolbarStore = useToolbarStore()
const pointerPosition = usePointerTracker()

const currentlyDrawnShape = computed(() => {
  if (!canvasStore.currentlyDrawnShape) return null
  let shapeCopy = lodash.cloneDeep(canvasStore.currentlyDrawnShape)
  let positionOnCanvas = getPositionOnCanvas(pointerPosition.value)
  shapeCopy.addPoint(positionOnCanvas)
  return shapeCopy
})

function initializeComponent() {
  let canvasElement = canvasElementRef.value
  let wrapperElement = canvasWrapperElementRef.value
  if (!canvasElement || !wrapperElement) {
    logger.error('Canvas or canvas wrapper element not present!')
    return
  }

  initializeCanvas(canvasElement, wrapperElement)
  logger.debug('Canvas ready!')
  emit('canvasReady')
}

function initializeCanvas(
  canvasElement: CanvasElement,
  wrapperElement: HTMLDivElement
) {
  function resizeCallback() {
    canvasWidth.value = wrapperElement.clientWidth
    canvasHeight.value = wrapperElement.clientHeight
    logger.debug(
      `Canvas resized to w: ${canvasWidth.value} y:${canvasHeight.value}`
    )
  }

  const canvasBoundingRect = canvasElement.getBoundingClientRect()
  canvasStore.canvasPosition = {
    left: canvasBoundingRect.left,
    top: canvasBoundingRect.top
  }

  installPointerEventHandlers(canvasElement)

  resizeCallback()
  new ResizeObserver(resizeCallback).observe(wrapperElement)
}

function installPointerEventHandlers(canvasElement: CanvasElement) {
  const handledPointerEvents = lodash.values(EPointerEvent)
  const callPointerEventHandler =
    (eventType: EPointerEvent) => (event: PointerEvent) =>
      toolbarStore.activeTool?.handlePointerEvent(eventType, event)

  for (const event of handledPointerEvents) {
    canvasElement.addEventListener(event, callPointerEventHandler(event))
  }
}

onMounted(initializeComponent)
</script>

<template>
  <div id="canvas-wrapper" ref="canvasWrapperElementRef">
    <svg
      id="main-canvas"
      ref="canvasElementRef"
      :width="canvasWidth"
      :height="canvasHeight"
    >
      <SvgShapeDrawer :shapes="canvasStore.drawnShapes"></SvgShapeDrawer>
      <SvgPolylineShape
        v-if="currentlyDrawnShape"
        :shape="currentlyDrawnShape"
      ></SvgPolylineShape>
    </svg>
  </div>
</template>

<style scoped lang="scss">
#canvas-wrapper {
  display: flex;
  flex: 1 1 auto;
  // &:hover {
  //   // cursor: url('/pointers/pencil-solid.svg') 0 0, auto;
  // }
}

#main-canvas {
  touch-action: none;
}
</style>
