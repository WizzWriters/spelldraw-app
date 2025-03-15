<script setup lang="ts">
import { computed, ref, toRef, type Ref } from 'vue'
import type { Point } from '@/common/definitions/Geometry'
import type { Polyline } from '@/common/definitions/Shape'
import BezierShapeSmoother, {
  type BezierCurve
} from '@/services/smoothing/BezierShapeSmoother'
import { useCollisionDetection } from './composables/useCollisionDetection'
import type ISvgShapeProperties from '../SvgShapeInterface'
import { useColorStore } from '@/store/ColorStore'

const colorStore = useColorStore()

const props = defineProps<{
  shapeProp: any
  shapeProperties: ISvgShapeProperties
}>()

const shape = toRef(props, 'shapeProp') as Ref<Polyline>
const polylineElementRef: Ref<(SVGGeometryElement & HTMLElement) | null> =
  ref(null)

function pointToString(point: Point) {
  return `${point.xCoordinate} ${point.yCoordinate}`
}

function nextBezierSegment(bezierCurve: BezierCurve) {
  switch (bezierCurve.controlPoints.length) {
    case 0:
      return ` L ${pointToString(bezierCurve.end)}`
    case 1:
      return (
        ` Q ${pointToString(bezierCurve.controlPoints[0])},` +
        ` ${pointToString(bezierCurve.end)}`
      )
    case 2:
      return (
        ` C ${pointToString(bezierCurve.controlPoints[0])},` +
        ` ${pointToString(bezierCurve.controlPoints[1])},` +
        ` ${pointToString(bezierCurve.end)}`
      )
    default:
      return ''
  }
}

const pathCommand = computed(() => {
  const pointList = shape.value.pointList
  const bezierCurves = BezierShapeSmoother.getBezierCurves(pointList)
  let result = ''

  if (bezierCurves.length == 0) {
    return ''
  }

  result += `M ${pointToString(bezierCurves[0].start)}`
  for (const bezierCurve of bezierCurves) {
    result += nextBezierSegment(bezierCurve)
  }
  return result
})

const strokeWidth = computed(() => {
  if (colorStore.adjustedStrokeWidth && props.shapeProperties.selected)
    return colorStore.adjustedStrokeWidth
  return shape.value.strokeWidth
})

useCollisionDetection(
  polylineElementRef,
  toRef(props, 'shapeProp'),
  toRef(props.shapeProperties, 'subjectsToCollisionDetection')
)
</script>

<template>
  <circle
    ref="polylineElementRef"
    v-if="shape.pointList.length == 1"
    :cx="shape.pointList[0].xCoordinate"
    :cy="shape.pointList[0].yCoordinate"
    r="1"
    :filter="props.shapeProperties.highlighted ? 'url(#neon-glow)' : ''"
  >
  </circle>
  <path
    v-else
    ref="polylineElementRef"
    :d="pathCommand"
    :filter="props.shapeProperties.highlighted ? 'url(#neon-glow)' : ''"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    shape-rendering="geometricPrecision"
  />
</template>
