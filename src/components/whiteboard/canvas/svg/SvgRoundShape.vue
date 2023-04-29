<script setup lang="ts">
import { Point, type RoundShape } from '@/common/definitions/Geometry'
import Logger from 'js-logger'
import { computed, ref, type Ref } from 'vue'
import { useIntersectionDetection } from './useIntersectionDetection'

const props = defineProps<{
  shape: RoundShape
}>()

const logger = Logger.get('SvgRoundShape')
const roundShapeElementRef: Ref<SVGGeometryElement | null> = ref(null)

function getControlPoint(starPoint: Point, endPoint: Point): Point {
  let centroid = props.shape.centroid
  return new Point(
    starPoint.xCoordinate + endPoint.xCoordinate - centroid.xCoordinate,
    starPoint.yCoordinate + endPoint.yCoordinate - centroid.yCoordinate
  )
}

function pointToString(point: Point) {
  return `${point.xCoordinate} ${point.yCoordinate}`
}

let pathCommand = computed(() => {
  const pointList = props.shape.pointList
  const numberOfPoints = pointList.length
  let command = ''
  if (numberOfPoints < 4) {
    logger.error('Wrong number of points for a round shape')
    return command
  }

  command += `M ${pointToString(pointList[0])}`
  for (let i = 0; i < numberOfPoints; i++) {
    const startPoint = pointList[i]
    const nextPoint = pointList[i + 1 == numberOfPoints ? 0 : i + 1]
    const controlPoint = getControlPoint(startPoint, nextPoint)
    command += `Q ${pointToString(controlPoint)} ${pointToString(nextPoint)}`
  }

  return command
})

useIntersectionDetection(roundShapeElementRef, props.shape.id)
</script>

<template>
  <path
    ref="roundShapeElementRef"
    :d="pathCommand"
    stroke="black"
    fill="none"
  />
</template>
