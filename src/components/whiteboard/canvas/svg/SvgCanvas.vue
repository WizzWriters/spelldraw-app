<script setup lang="ts">
import Logger from 'js-logger'
import { ref, onMounted, type Ref } from 'vue'
import type { ECanvasPointerEvent, ICanvas } from '@/services/canvas/Canvas'
import {
  RoundShape,
  Point,
  Polygon,
  Polyline,
  Shape
} from '@/services/canvas/Geometry'
import SvgPolylineShape from './SvgPolylineShape.vue'
import SvgPolygonShape from './SvgPolygonShape.vue'
import SvgEllipse from './SvgEllipse.vue'
import { usePointerTracker } from '@/composables/PointerTracker'
import type { IPointerPosition } from '@/services/canvas/Pointer'

type CavasElement = HTMLElement & SVGElement

const logger = Logger.get('SvgCanvas.vue')
const canvasElementRef = ref<CavasElement | null>(null)
const canvasWrapperElementRef = ref<HTMLDivElement | null>(null)

const canvasWidth = ref<number>(0)
const canvasHeight = ref<number>(0)
const drawnPolylineShapes = ref<Array<Polyline>>([]) as Ref<Array<Polyline>>
const drawnPolygonShapes = ref<Array<Polygon>>([]) as Ref<Array<Polygon>>
const drawnRoundShapes = ref<Array<RoundShape>>([]) as Ref<Array<RoundShape>>

const emit = defineEmits<{
  (e: 'canvasReady', canvas: ICanvas): void
}>()

let pointerPosition = usePointerTracker()

class SvgCanvas implements ICanvas {
  private canvasElement: CavasElement

  constructor(canvasElement: CavasElement) {
    this.canvasElement = canvasElement
  }

  public resize(width: number, height: number): void {
    canvasWidth.value = width
    canvasHeight.value = height
    logger.debug('Canvas resized to x:' + width + ' y:' + height)
  }

  public getPointerPosition(absolutePointerPosition?: IPointerPosition): Point {
    if (!absolutePointerPosition) {
      absolutePointerPosition = pointerPosition.value
    }
    const absoluteX = absolutePointerPosition.xCoordinate
    const absoluteY = absolutePointerPosition.yCoordinate
    const boundingRect = this.canvasElement.getBoundingClientRect()
    return new Point(
      absoluteX - boundingRect.left,
      absoluteY - boundingRect.top
    )
  }

  public atPointerEvent(
    eventType: ECanvasPointerEvent,
    callback: (event: PointerEvent) => void
  ): void {
    this.canvasElement.addEventListener(eventType, callback)
  }

  public drawShape(shape: Shape): void {
    if (shape instanceof Polyline) drawnPolylineShapes.value.push(shape)
    if (shape instanceof Polygon) drawnPolygonShapes.value.push(shape)
    if (shape instanceof RoundShape) drawnRoundShapes.value.push(shape)
  }

  public clear(): void {
    drawnPolylineShapes.value = []
    drawnPolygonShapes.value = []
    drawnRoundShapes.value = []
  }
}

let canvas: SvgCanvas

function initializeComponent() {
  let canvasElement = canvasElementRef.value
  let wrapperElement = canvasWrapperElementRef.value
  if (!canvasElement || !wrapperElement) {
    logger.error('Canvas or canvas wrapper element not present!')
    return
  }

  canvas = initializeCanvas(canvasElement, wrapperElement)
  logger.debug('Canvas ready!')
  emit('canvasReady', canvas)
}

function initializeCanvas(
  canvasElement: CavasElement,
  wrapperElement: HTMLDivElement
): SvgCanvas {
  let canvas = new SvgCanvas(canvasElement)

  function resizeCallback() {
    const displayedWidth = wrapperElement!.clientWidth
    const displayedHeight = wrapperElement!.clientHeight
    canvas.resize(displayedWidth, displayedHeight)
  }

  resizeCallback()
  new ResizeObserver(resizeCallback).observe(wrapperElement)
  return canvas
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
      <SvgPolylineShape
        v-for="(shape, idx) in drawnPolylineShapes"
        :key="idx"
        :shape="shape"
      ></SvgPolylineShape>
      <SvgPolygonShape
        v-for="(shape, idx) in drawnPolygonShapes"
        :key="idx"
        :shape="shape"
      ></SvgPolygonShape>
      <SvgEllipse
        v-for="(shape, idx) in drawnRoundShapes"
        :key="idx"
        :shape="shape"
      ></SvgEllipse>
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
