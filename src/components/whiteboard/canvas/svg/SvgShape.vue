<script setup lang="ts">
import {
  Polygon,
  Polyline,
  RoundShape,
  type Shape
} from '@/common/definitions/Shape'
import SvgPolylineShape from './shapes/SvgPolyline.vue'
import SvgPolygonShape from './shapes/SvgPolygon.vue'
import SvgRoundShape from './shapes/SvgRoundShape.vue'

const props = defineProps<{
  shape: Shape
  glows: Boolean
}>()

function getShapeComponent(shape: Shape) {
  if (shape instanceof Polyline) return SvgPolylineShape
  if (shape instanceof Polygon) return SvgPolygonShape
  if (shape instanceof RoundShape) return SvgRoundShape
  throw Error('Unknown shape type caught')
}
</script>

<template>
  <component
    :is="getShapeComponent(props.shape)"
    :shape="props.shape"
    :glows="props.glows"
    :filter="props.glows ? 'url(#neon-glow)' : ''"
    stroke="black"
    fill="none"
  />
</template>
