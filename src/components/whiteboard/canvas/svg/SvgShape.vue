<script setup lang="ts">
import {
  Polygon,
  Polyline,
  RoundShape,
  TextBox,
  type Shape
} from '@/common/definitions/Shape'
import { rgbColorToString } from '@/helpers/Svg'
import SvgPolylineShape from './shapes/SvgPolyline.vue'
import SvgPolygonShape from './shapes/SvgPolygon.vue'
import SvgRoundShape from './shapes/SvgRoundShape.vue'
import SvgTextbox from './shapes/SvgTextbox.vue'

const props = defineProps<{
  shape: Shape
  highlighted: Boolean
  collisionsEnabled: Boolean
}>()

function getShapeComponent(shape: Shape) {
  if (shape instanceof Polyline) return SvgPolylineShape
  if (shape instanceof Polygon) return SvgPolygonShape
  if (shape instanceof RoundShape) return SvgRoundShape
  if (shape instanceof TextBox) return SvgTextbox
  throw Error('Unknown shape type caught')
}
</script>

<template>
  <component
    :is="getShapeComponent(props.shape)"
    :shape-prop="props.shape"
    :highlighted="props.highlighted"
    :collisionsEnabled="props.collisionsEnabled"
    :stroke="rgbColorToString(props.shape.strokeColor)"
    :stroke-opacity="props.shape.strokeColor.opacity"
    :fill="rgbColorToString(props.shape.fillColor)"
    :fill-opacity="props.shape.fillColor?.opacity"
  />
</template>
