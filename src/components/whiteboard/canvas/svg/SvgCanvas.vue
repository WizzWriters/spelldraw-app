<script setup lang="ts">
import Logger from 'js-logger'
import { ref, onMounted, watch, computed } from 'vue'
import { usePointerTracker } from '@/common/composables/PointerTracker'
import { useCanvasStore } from '@/store/CanvasStore'
import SvgShapeDrawer from './SvgShapeDrawer.vue'
import SvgPolylineShape from './SvgPolylineShape.vue'
import ShapeCollector from '@/services/canvas/ShapeCollector'
import lodash from 'lodash'

type CavasElement = HTMLElement & SVGElement

const logger = Logger.get('SvgCanvas.vue')
const canvasElementRef = ref<CavasElement | null>(null)
const canvasWrapperElementRef = ref<HTMLDivElement | null>(null)

const canvasWidth = ref<number>(0)
const canvasHeight = ref<number>(0)

const emit = defineEmits<{ (e: 'canvasReady'): void }>()

let canvasStore = useCanvasStore()
let pointerPosition = usePointerTracker()
let currentlyDrawnShape = computed(() => {
  if (!canvasStore.currentlyDrawnShape) return null
  let shapeCopy = lodash.cloneDeep(canvasStore.currentlyDrawnShape)
  shapeCopy.addPoint(canvasStore.pointerPosition)
  return shapeCopy
})

let shapeCollector: ShapeCollector

function initializeComponent() {
  let canvasElement = canvasElementRef.value
  let wrapperElement = canvasWrapperElementRef.value
  if (!canvasElement || !wrapperElement) {
    logger.error('Canvas or canvas wrapper element not present!')
    return
  }

  initializeCanvas(canvasElement, wrapperElement)
  shapeCollector = new ShapeCollector(canvasElement)
  shapeCollector.atShapeCollected((shape) => {
    canvasStore.drawnShapes.push(shape)
  })
  shapeCollector.startCollectingShapes()
  logger.debug('Canvas ready!')
  emit('canvasReady')
}

function initializeCanvas(
  canvasElement: CavasElement,
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

  watch(
    pointerPosition,
    (newValue) => {
      canvasStore.pointerPosition =
        canvasStore.getPositionOnCanvasFromPointerPosition(newValue)
    },
    { deep: true }
  )

  resizeCallback()
  new ResizeObserver(resizeCallback).observe(wrapperElement)
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
}

#main-canvas {
  touch-action: none;
}
</style>
