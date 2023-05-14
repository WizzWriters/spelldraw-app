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
  const intersecting = toolbarStore.intersectingShapesIds.has(shapeId)
  const selected = toolbarStore.selectedShapesIds.has(shapeId)
  return intersecting || selected
}
</script>

<template>
  <SvgShape
    v-if="currentlyDrawnShape"
    :shape="currentlyDrawnShape"
    :glows="false"
    :collisions-enabled="false"
  />
  <SvgShape
    v-for="shape in props.shapes"
    :key="shape.id"
    :shape="shape"
    :glows="shouldGlow(shape.id)"
    :collisions-enabled="true"
  />
</template>
