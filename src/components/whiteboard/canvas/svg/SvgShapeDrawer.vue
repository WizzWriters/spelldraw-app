<script setup lang="ts">
import type { Shape } from '@/common/definitions/Shape'
import { useToolbarStore } from '@/store/ToolbarStore'
import SvgShape from './SvgShape.vue'

const props = defineProps<{
  shapes: Array<Shape>
  currentlyDrawnShape: Shape | null
}>()

function getShapeProperties(shapeId: string) {
  const toolbarStore = useToolbarStore()
  const intersecting = toolbarStore.intersectingShapesIds.has(shapeId)
  const selected = toolbarStore.selectedShapesIds.has(shapeId)
  return {
    selected,
    intersecting,
    highlighted: selected || intersecting,
    subjectsToCollisionDetection: shapeId != props.currentlyDrawnShape?.id
  }
}
</script>

<template>
  <SvgShape
    v-if="currentlyDrawnShape"
    :shape="currentlyDrawnShape"
    :shape-properties="getShapeProperties(currentlyDrawnShape.id)"
  />
  <SvgShape
    v-for="shape in props.shapes"
    :key="shape.id"
    :shape="shape"
    :shape-properties="getShapeProperties(shape.id)"
  />
</template>
