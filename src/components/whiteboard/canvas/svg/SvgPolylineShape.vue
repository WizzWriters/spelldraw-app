<script setup lang="ts">
import { computed } from 'vue'
import { Segment, type Point, type Polyline } from '@/services/canvas/Geometry'
import lodash from 'lodash'

const props = defineProps<{
  shape: Polyline
}>()

function pointToString(point: Point) {
  return `${point.xCoordinate} ${point.yCoordinate}`
}

function makeSmoothBezierTransitions(pointList: Array<Point>) {
  let pointListLength = pointList.length

  for (let i = 3; i < pointListLength; i += 3) {
    if (!pointList[i + 1]) break

    pointList[i] = new Segment(pointList[i - 1], pointList[i + 1]).midpoint
  }
}

function nextBezierSegment(pointList: Array<Point>) {
  let listLength = pointList.length
  switch (listLength) {
    case 0:
      return ''
    case 1:
      return ` L ${pointToString(pointList[0])}`
    case 2:
      return ` Q ${pointToString(pointList[0])}, ${pointToString(pointList[1])}`
    case 3:
      return (
        ` C ${pointToString(pointList[0])},` +
        ` ${pointToString(pointList[1])},` +
        ` ${pointToString(pointList[2])}`
      )
    default:
      return ''
  }
}

let pathCommand = computed(() => {
  let pointList = lodash.cloneDeep(props.shape.getPointList())
  makeSmoothBezierTransitions(pointList)
  let result = ''

  if (pointList.length == 0) {
    return result
  }

  result += `M ${pointList[0].xCoordinate} ${pointList[0].yCoordinate}`
  let pointListLength = pointList.length
  let bezieredPoints = 1

  for (let i = 3; i <= pointListLength - 1; i += 3) {
    result += nextBezierSegment([
      pointList[i - 2],
      pointList[i - 1],
      pointList[i]
    ])
    bezieredPoints += 3
  }

  return result + nextBezierSegment(pointList.slice(bezieredPoints))
})
</script>

<template>
  <path :d="pathCommand" fill="none" stroke="black" />
  <!-- <circle v-for="(point, idx) in props.shape.getPointList()" :key="idx" :cx="point.xCoordinate" :cy="point.yCoordinate" r="2"></circle> -->
</template>
