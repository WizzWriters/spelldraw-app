<script setup lang="ts">
import { computed, ref, toRef, type Ref } from 'vue'
import type { Point } from '@/common/definitions/Geometry'
import type { Polyline } from '@/common/definitions/Shape'
import BezierShapeSmoother, {
  type BezierCurve
} from '@/services/smoothing/BezierShapeSmoother'
import { useIntersectionDetection } from './useIntersectionDetection'

const props = defineProps<{
  shape: any
  glows: Boolean
}>()

const shape = toRef(props, 'shape') as Ref<Polyline>
const polylineElementRef: Ref<SVGGeometryElement | null> = ref(null)

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
  let pointList = shape.value.pointList
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

useIntersectionDetection(polylineElementRef, toRef(props, 'shape'))
</script>

<template>
  <circle
    ref="polylineElementRef"
    v-if="shape.pointList.length == 1"
    :cx="shape.pointList[0].xCoordinate"
    :cy="shape.pointList[0].yCoordinate"
    r="1"
  >
  </circle>
  <path v-else ref="polylineElementRef" :d="pathCommand" />
</template>