<script setup lang="ts">
import type { Point } from '@/common/definitions/Geometry'
import type { RoundShape } from '@/common/definitions/Shape'
import Logger from 'js-logger'
import { computed, ref, toRef, type Ref } from 'vue'
import { useCollisionDetection } from './composables/useCollisionDetection'
import type ISvgShapeProperties from '../SvgShapeInterface'
import { useColorStore } from '@/store/ColorStore'

const colorStore = useColorStore()

const props = defineProps<{
  shapeProp: any
  shapeProperties: ISvgShapeProperties
}>()

const shape = toRef(props, 'shapeProp') as Ref<RoundShape>
const logger = Logger.get('SvgRoundShape')
const roundShapeElementRef: Ref<(SVGGeometryElement & HTMLElement) | null> =
  ref(null)

function getControlPoint(starPoint: Point, endPoint: Point): Point {
  const centroid = shape.value.centroid
  return starPoint.add(endPoint).subtract(centroid)
}

function pointToString(point: Point) {
  return `${point.xCoordinate} ${point.yCoordinate}`
}

const pathCommand = computed(() => {
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

const strokeWidth = computed(() => {
  if (colorStore.adjustedStrokeWidth && props.shapeProperties.selected)
    return colorStore.adjustedStrokeWidth
  return shape.value.strokeWidth
})

useCollisionDetection(
  roundShapeElementRef,
  toRef(props, 'shapeProp'),
  toRef(props.shapeProperties, 'subjectsToCollisionDetection')
)
</script>

<template>
  <path
    ref="roundShapeElementRef"
    :d="pathCommand"
    :filter="props.shapeProperties.highlighted ? 'url(#neon-glow)' : ''"
    :stroke-width="strokeWidth"
  />
</template>
