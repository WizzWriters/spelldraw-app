<script setup lang="ts">
import type { Point } from '@/common/definitions/Geometry'
import type { RoundShape } from '@/common/definitions/Shape'
import Logger from 'js-logger'
import { computed, ref, toRef, type Ref } from 'vue'
import { useCollisionDetection } from './composables/useCollisionDetection'

const props = defineProps<{
  shapeProp: any
  highlighted: Boolean
  collisionsEnabled: Boolean
}>()

const shape = toRef(props, 'shapeProp') as Ref<RoundShape>
const logger = Logger.get('SvgRoundShape')
const roundShapeElementRef: Ref<(SVGGeometryElement & HTMLElement) | null> =
  ref(null)

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

useCollisionDetection(
  roundShapeElementRef,
  toRef(props, 'shapeProp'),
  toRef(props, 'collisionsEnabled')
)
</script>

<template>
  <path
    ref="roundShapeElementRef"
    :d="pathCommand"
    :filter="props.highlighted ? 'url(#neon-glow)' : ''"
  />
</template>
