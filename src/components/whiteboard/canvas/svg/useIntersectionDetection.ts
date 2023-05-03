import type { Point, Segment, Shape } from '@/common/definitions/Geometry'
import { useToolbarStore } from '@/store/ToolbarStore'
import { storeToRefs } from 'pinia'
import { watch, type Ref } from 'vue'

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
  shapeId: Ref<Shape>
) {
  const toolbarStore = useToolbarStore()
  const { pointerHitline } = storeToRefs(toolbarStore)

  function isPointInStroke(point: Point, canvas: SVGSVGElement) {
    const svgPoint = canvas.createSVGPoint()
    svgPoint.x = point.xCoordinate
    svgPoint.y = point.yCoordinate
    return elementRef.value!.isPointInStroke(svgPoint)
  }

  watch(pointerHitline, (newValue) => {
    if (!newValue) return
    const canvasElement = document.getElementById(
      'main-canvas'
    ) as unknown as SVGSVGElement | null
    if (!canvasElement) return

    for (const point of splitHitline(newValue as Segment)) {
      if (!isPointInStroke(point, canvasElement)) continue
      toolbarStore.addToIntersectingShapes(shapeId.value.id)
      return
    }
    toolbarStore.removeFromIntersectingShapes(shapeId.value.id)
  })
}
