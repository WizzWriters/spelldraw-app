<script setup lang="ts">
import { computed, ref, toRef, type Ref } from 'vue'
import type { Polygon } from '@/common/definitions/Shape'
import { useCollisionDetection } from './composables/useCollisionDetection'

const props = defineProps<{
  shapeProp: any
  highlighted: Boolean
  collisionsEnabled: Boolean
}>()

const shape = toRef(props, 'shapeProp') as Ref<Polygon>
const polygonElementRef: Ref<(SVGGeometryElement & HTMLElement) | null> =
  ref(null)

let pointsListStr = computed(() => {
  let pointList = shape.value.pointList
  let pointListstr = pointList.reduce((prev, point) => {
    return prev + ' ' + point.xCoordinate + ',' + point.yCoordinate
  }, '')
  return pointListstr
})

useCollisionDetection(
  polygonElementRef,
  toRef(props, 'shapeProp'),
  toRef(props, 'collisionsEnabled')
)
</script>

<template>
  <polygon
    ref="polygonElementRef"
    :points="pointsListStr"
    :filter="props.highlighted ? 'url(#neon-glow)' : ''"
    :stroke-width="shape.strokeWidth"
  />
</template>
