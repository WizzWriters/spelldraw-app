<script setup lang="ts">
import Logger from 'js-logger'
import { ref, onMounted, computed, type Ref } from 'vue'
import { usePointerTracker } from '@/common/composables/PointerTracker'
import { useCanvasStore } from '@/store/CanvasStore'
import SvgShapeDrawer from './SvgShapeDrawer.vue'
import SvgUsers from './SvgUsers.vue'
import lodash from 'lodash'
import { useToolbarStore } from '@/store/ToolbarStore'
import {
  EPointerEvent,
  ExternalPointerIcon,
  BuiltinPointerIcon
} from '@/common/definitions/Pointer'
import { getPositionOnCanvas } from '@/helpers/CanvasHelper'
import { Point } from '@/common/definitions/Geometry'
import SvgNeonGlow from './filters/SvgNeonGlow.vue'
import { Polyline, type Shape } from '@/common/definitions/Shape'

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

const pointerIcon = computed(() => {
  let activeToolIcon = toolbarStore.activeTool?.pointerIcon
  if (!activeToolIcon) return 'auto'
  if (activeToolIcon instanceof ExternalPointerIcon)
    return `url(${activeToolIcon.url}) ${activeToolIcon.hotspot.xCoordinate}
            ${activeToolIcon.hotspot.yCoordinate}, auto`
  else if (activeToolIcon instanceof BuiltinPointerIcon)
    return activeToolIcon.name
  throw Error('Unknown pointer icon type')
})

const currentlyDrawnShape: Ref<Shape | null> = computed(() => {
  const currentlyDrawnShape = canvasStore.currentlyDrawnShape
  if (!currentlyDrawnShape) return null
  if (!(currentlyDrawnShape instanceof Polyline)) return currentlyDrawnShape
  let shapeCopy = lodash.cloneDeep(canvasStore.currentlyDrawnShape) as Polyline
  let positionOnCanvas = getPositionOnCanvas(pointerPosition.value)
  let point = Point.fromPointerPosition(positionOnCanvas)
  shapeCopy.addPoint(point)
  return shapeCopy
})

const viewBox = computed(() => {
  return (
    `${canvasStore.canvasOffset.x} ${canvasStore.canvasOffset.y} ` +
    `${canvasWidth.value} ${canvasHeight.value}`
  )
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
      :viewBox="viewBox"
    >
      <defs>
        <SvgNeonGlow />
      </defs>
      <SvgShapeDrawer
        :shapes="canvasStore.drawnShapes"
        :currently-drawn-shape="currentlyDrawnShape"
      />
      <SvgUsers></SvgUsers>
    </svg>
  </div>
</template>

<style lang="scss">
#canvas-wrapper {
  height: 100%;
  display: flex;
  flex: 1 1 auto;
  &:hover {
    cursor: v-bind(pointerIcon);
  }
}

#main-canvas {
  touch-action: none;
}
</style>
