import type { Point, Segment } from '@/common/definitions/Geometry'
import type { Shape } from '@/common/definitions/Shape'
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

export function useIntersectionDetection(
  elementRef: Ref<SVGGeometryElement | null>,
  shape: Ref<Shape>,
  enabled: Ref<Boolean>
) {
  const toolbarStore = useToolbarStore()

  function isPointInStroke(point: Point, canvas: SVGSVGElement) {
    const svgPoint = canvas.createSVGPoint()
    svgPoint.x = point.xCoordinate
    svgPoint.y = point.yCoordinate
    return elementRef.value!.isPointInStroke(svgPoint)
  }

  function checkIntersection(pointerHitline: Segment) {
    const canvasElement = document.getElementById(
      'main-canvas'
    ) as unknown as SVGSVGElement | null
    if (!canvasElement) return

    for (const point of splitHitline(pointerHitline)) {
      if (!isPointInStroke(point, canvasElement)) continue
      toolbarStore.addToIntersectingShapes(shape.value.id)
      return
    }
    toolbarStore.removeFromIntersectingShapes(shape.value.id)
  }

  const intersectionCallback = new EventCallback<ICheckIntersectionPayload>(
    (payload) => checkIntersection(payload.pointerHitline)
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
