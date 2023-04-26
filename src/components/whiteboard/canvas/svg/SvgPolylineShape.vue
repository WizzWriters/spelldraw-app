<script setup lang="ts">
import { computed } from 'vue'
import type { Point, Polyline } from '@/common/definitions/Geometry'
import BezierShapeSmoother, {
  type BezierCurve
} from '@/services/smoothing/BezierShapeSmoother'

const props = defineProps<{
  shape: Polyline
}>()

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

let pathCommand = computed(() => {
  let pointList = props.shape.pointList
  let bezierCurves = BezierShapeSmoother.getBezierCurves(pointList)
  let result = ''

  if (bezierCurves.length == 0) {
    return ''
  }

  result += `M ${pointToString(bezierCurves[0].start)}`
  for (let bezierCurve of bezierCurves) {
    result += nextBezierSegment(bezierCurve)
  }
  return result
})
</script>

<template>
  <circle
    v-if="props.shape.pointList.length == 1"
    :cx="props.shape.pointList[0].xCoordinate"
    :cy="props.shape.pointList[0].yCoordinate"
    r="1"
  >
  </circle>
  <path v-else :d="pathCommand" fill="none" stroke="black" />
</template>
