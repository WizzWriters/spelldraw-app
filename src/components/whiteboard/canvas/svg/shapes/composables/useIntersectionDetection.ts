import type { Point, Rectangle, Segment } from '@/common/definitions/Geometry'
import type {
  PointListBasedShape,
  Shape,
  TextBox
} from '@/common/definitions/Shape'
import EventBus, {
  EShapeEvent,
  EventCallback,
  type ICheckIntersectionPayload
} from '@/services/bus/EventBus'
import { useToolbarStore } from '@/store/ToolbarStore'
import { onMounted, onUnmounted, type Ref } from 'vue'

const INCREMENT_SIZE = 0.5

function splitHitline(hitline: Segment) {
  const result = [hitline.start]
  const hitlineLength = hitline.length
  const numberOfSegments = hitlineLength / INCREMENT_SIZE
  for (let i = 1; i <= numberOfSegments; i++) {
    result.push(hitline.getPointAtLength(INCREMENT_SIZE * i))
  }
  if (!Number.isInteger(numberOfSegments)) {
    result.push(hitline.end)
  }
  return result
}

function isPointInStroke(
  point: Point,
  element: SVGGeometryElement,
  canvas: SVGSVGElement
) {
  const svgPoint = canvas.createSVGPoint()
  svgPoint.x = point.xCoordinate
  svgPoint.y = point.yCoordinate
  return element.isPointInStroke(svgPoint)
}

function checkIntersectionWithGeometryElement(
  pointerHitline: Segment,
  element: SVGGeometryElement
) {
  const canvasElement = document.getElementById(
    'main-canvas'
  ) as unknown as SVGSVGElement | null
  if (!canvasElement) return false

  for (const point of splitHitline(pointerHitline)) {
    if (isPointInStroke(point, element, canvasElement)) return true
  }
  return false
}

function checkIntesectionWithBox(pointerHitline: Segment, box: Rectangle) {
  for (const point of splitHitline(pointerHitline)) {
    if (box.contains(point)) return true
  }
  return false
}

export function useIntersectionDetection(
  elementRef: Ref<SVGTextElement | null>,
  shape: Ref<TextBox>,
  enabled: Ref<Boolean>
): void
export function useIntersectionDetection(
  elementRef: Ref<SVGGeometryElement | null>,
  shape: Ref<PointListBasedShape>,
  enabled: Ref<Boolean>
): void
export function useIntersectionDetection(
  elementRef: Ref<SVGGeometryElement | SVGTextElement | null>,
  shape: Ref<Shape>,
  enabled: Ref<Boolean>
) {
  const toolbarStore = useToolbarStore()

  const intersectionCallback = new EventCallback<ICheckIntersectionPayload>(
    (payload) => {
      let isIntersecting = false
      const element = elementRef.value
      if (!element) return

      if (element instanceof SVGGeometryElement) {
        isIntersecting = checkIntersectionWithGeometryElement(
          payload.pointerHitline,
          element
        )
      }

      if (element instanceof SVGTextElement) {
        isIntersecting = checkIntesectionWithBox(
          payload.pointerHitline,
          shape.value.getBoundingRectangle()
        )
      }

      if (isIntersecting) toolbarStore.addToIntersectingShapes(shape.value.id)
      else toolbarStore.removeFromIntersectingShapes(shape.value.id)
    }
  )

  function enable() {
    EventBus.subscribe(EShapeEvent.CHECK_INTERSECTION, intersectionCallback)
  }

  function disable() {
    EventBus.unsubscribe(EShapeEvent.CHECK_INTERSECTION, intersectionCallback)
  }

  onMounted(() => {
    if (enabled.value) enable()
  })

  onUnmounted(() => disable())
}
