<script setup lang="ts">
import {
  Polygon,
  Polyline,
  RoundShape,
  Shape
} from '@/common/definitions/Shape'
import { computed } from 'vue'
import SvgPolylineShape from './SvgPolylineShape.vue'
import SvgPolygonShape from './SvgPolygonShape.vue'
import SvgRoundShape from './SvgRoundShape.vue'
import { useToolbarStore } from '@/store/ToolbarStore'

const props = defineProps<{
  shapes: Array<Shape>
}>()
const toolbarStore = useToolbarStore()

let polylineShapes = computed(() => {
  let polylines = props.shapes.filter((shape) => shape instanceof Polyline)
  /* Typescript cannot tell that we filtered out other types of shapes */
  return polylines as unknown as Polyline[]
})

let polygonShapes = computed(() => {
  let polygons = props.shapes.filter((shape) => shape instanceof Polygon)
  return polygons as unknown as Polygon[]
})

let roundShapes = computed(() => {
  let rounds = props.shapes.filter((shape) => shape instanceof RoundShape)
  return rounds as unknown as RoundShape[]
})

function shouldGlow(shapeId: string) {
  const index = toolbarStore.intersectingShapesIds.findIndex(
    (intersectingShapeId) => intersectingShapeId == shapeId
  )
  return index != -1
}
</script>

<template>
  <SvgPolylineShape
    v-for="(shape, idx) in polylineShapes"
    :key="idx"
    :shape="shape"
    :glows="shouldGlow(shape.id)"
  ></SvgPolylineShape>
  <SvgPolygonShape
    v-for="(shape, idx) in polygonShapes"
    :key="idx"
    :shape="shape"
    :glows="shouldGlow(shape.id)"
  ></SvgPolygonShape>
  <SvgRoundShape
    v-for="(shape, idx) in roundShapes"
    :key="idx"
    :shape="shape"
    :glows="shouldGlow(shape.id)"
  ></SvgRoundShape>
</template>
