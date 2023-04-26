<script setup lang="ts">
import { computed } from 'vue'
import type { Polygon } from '@/common/definitions/Geometry'

const props = defineProps<{
  shape: Polygon
}>()

let pointsListStr = computed(() => {
  let pointList = props.shape.getPointList()
  let pointListstr = pointList.reduce((prev, point) => {
    return prev + ' ' + point.xCoordinate + ',' + point.yCoordinate
  }, '')
  return pointListstr
})
</script>

<template>
  <polygon :points="pointsListStr" fill="none" stroke="black" />
</template>
