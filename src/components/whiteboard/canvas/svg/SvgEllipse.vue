<script setup lang="ts">
import { Point, type RoundShape } from '@/services/canvas/Geometry'
import { computed } from 'vue'

const props = defineProps<{
  shape: RoundShape
}>()

function getControlPoint(starPoint: Point, endPoint: Point): Point {
  let centroid = props.shape.centroid
  return new Point(
    starPoint.xCoordinate + endPoint.xCoordinate - centroid.xCoordinate,
    starPoint.yCoordinate + endPoint.yCoordinate - centroid.yCoordinate
  )
}

let curves = computed(() => {
  let curves: string[] = []
  let numberOfPoints = props.shape.pointList.length
  for (let i = 0; i < numberOfPoints; i++) {
    let startPoint = props.shape.pointList[i]
    let nextPoint = props.shape.pointList[i + 1 == numberOfPoints ? 0 : i + 1]
    let controlPoint = getControlPoint(startPoint, nextPoint)
    curves.push(
      `M ${startPoint.xCoordinate} ${startPoint.yCoordinate} ` +
        `Q ${controlPoint.xCoordinate} ${controlPoint.yCoordinate} ` +
        `${nextPoint.xCoordinate} ${nextPoint.yCoordinate}`
    )
  }
  return curves
})
</script>

<template>
  <path
    v-for="(curve, idx) of curves"
    v-bind:key="idx"
    :d="curve"
    stroke="black"
    fill="none"
  />
</template>
