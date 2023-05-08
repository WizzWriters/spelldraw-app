<script setup lang="ts">
import type { Point } from '@/common/definitions/Geometry'
import type { RoundShape } from '@/common/definitions/Shape'
import Logger from 'js-logger'
import { computed, ref, toRef, type Ref } from 'vue'
import { useIntersectionDetection } from './useIntersectionDetection'

const props = defineProps<{
  shape: any
  glows: Boolean
}>()

const shape = toRef(props, 'shape') as Ref<RoundShape>
const logger = Logger.get('SvgRoundShape')
const roundShapeElementRef: Ref<SVGGeometryElement | null> = ref(null)

function getControlPoint(starPoint: Point, endPoint: Point): Point {
  let centroid = shape.value.centroid
  return starPoint.add(endPoint).subtract(centroid)
}

function pointToString(point: Point) {
  return `${point.xCoordinate} ${point.yCoordinate}`
}

let pathCommand = computed(() => {
  const pointList = shape.value.pointList
  const numberOfPoints = pointList.length
  let command = ''
  if (numberOfPoints < 4) {
    logger.error('Wrong number of points for a round shape')
    return command
  }

  command += `M ${pointToString(pointList[0])}`
  for (let i = 0; i < numberOfPoints; i++) {
    const startPoint = pointList[i]
    const nextPoint = pointList[(i + 1) % numberOfPoints]
    const controlPoint = getControlPoint(startPoint, nextPoint)
    command += `Q ${pointToString(controlPoint)} ${pointToString(nextPoint)}`
  }

  return command
})

useIntersectionDetection(roundShapeElementRef, toRef(props, 'shape'))
</script>

<template>
  <path ref="roundShapeElementRef" :d="pathCommand" />
</template>