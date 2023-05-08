<script setup lang="ts">
import type { Shape } from '@/common/definitions/Shape'
import { useToolbarStore } from '@/store/ToolbarStore'
import SvgShape from './SvgShape.vue'

const props = defineProps<{
  shapes: Array<Shape>
  currentlyDrawnShape: Shape | null
}>()
const toolbarStore = useToolbarStore()

function shouldGlow(shapeId: string) {
  const index = toolbarStore.intersectingShapesIds.findIndex(
    (intersectingShapeId) => intersectingShapeId == shapeId
  )
  return index != -1
}
</script>

<template>
  <SvgShape
    v-if="currentlyDrawnShape"
    :shape="currentlyDrawnShape"
    :glows="false"
  />
  <SvgShape
    v-for="(shape, idx) in props.shapes"
    :key="idx"
    :shape="shape"
    :glows="shouldGlow(shape.id)"
  />
</template>
