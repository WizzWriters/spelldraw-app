<script setup lang="ts">
import { computed } from 'vue'
import type { PolyLineShape } from '@/services/canvas/Geometry'

const props = defineProps<{
  shape: PolyLineShape
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
  <polyline :points="pointsListStr" fill="none" stroke="black" />
</template>
