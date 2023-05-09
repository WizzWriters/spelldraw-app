<script setup lang="ts">
import { computed, ref, toRef, type Ref } from 'vue'
import type { Polygon } from '@/common/definitions/Shape'
import { useIntersectionDetection } from './useIntersectionDetection'

const props = defineProps<{
  shape: any
  glows: Boolean
}>()

const shape = toRef(props, 'shape') as Ref<Polygon>
const polygonElementRef: Ref<SVGGeometryElement | null> = ref(null)

let pointsListStr = computed(() => {
  let pointList = shape.value.pointList
  let pointListstr = pointList.reduce((prev, point) => {
    return prev + ' ' + point.xCoordinate + ',' + point.yCoordinate
  }, '')
  return pointListstr
})

useIntersectionDetection(polygonElementRef, toRef(props, 'shape'))
</script>

<template>
  <polygon ref="polygonElementRef" :points="pointsListStr" />
</template>
