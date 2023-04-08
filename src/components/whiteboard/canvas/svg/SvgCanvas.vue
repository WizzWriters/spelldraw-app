<script setup lang="ts">
import Logger from 'js-logger'
import { ref, onMounted, type Ref } from 'vue'
import type { IPointerPosition } from '../../PointerTracker'
import type { ECanvasPointerEvent, ICanvas } from '../Canvas'
import { Point, Shape } from '../Geometry'
import SvgShape from './SvgShape.vue'

type CavasElement = HTMLElement & SVGElement

const logger = Logger.get('SvgCanvas.vue')
const canvasElementRef = ref<CavasElement | null>(null)
const canvasWrapperElementRef = ref<HTMLDivElement | null>(null)

const canvasWidth = ref<number>(0)
const canvasHeight = ref<number>(0)
const drawnShapes = ref<Array<Shape>>([]) as Ref<Array<Shape>>

const emit = defineEmits<{
  (e: 'canvasReady', canvas: ICanvas): void
}>()

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

  public getPointFromPointerPosition(
    absolutePointerPosition: IPointerPosition
  ): Point {
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
    drawnShapes.value.push(shape)
  }

  public clear(): void {
    drawnShapes.value = []
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
      <SvgShape
        v-for="(shape, idx) in drawnShapes"
        :shape="shape"
        :key="idx"
      ></SvgShape>
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
