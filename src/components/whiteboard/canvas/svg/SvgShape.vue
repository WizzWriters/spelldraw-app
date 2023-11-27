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
import type SvgShapeProperties from './SvgShapeInterface'
import { useColorStore } from '@/store/ColorStore'
import { computed } from 'vue'

const colorStore = useColorStore()

const props = defineProps<{
  shape: Shape
  shapeProperties: SvgShapeProperties
}>()

function getShapeComponent(shape: Shape) {
  if (shape instanceof Polyline) return SvgPolylineShape
  if (shape instanceof Polygon) return SvgPolygonShape
  if (shape instanceof RoundShape) return SvgRoundShape
  if (shape instanceof TextBox) return SvgTextbox
  throw Error('Unknown shape type caught')
}

/* Selected shapes react to user changing the color in real time, but the
   actual state of the shape objects is not mutated */
let strokeColor = computed(() => {
  if (colorStore.adjustedStrokeColor && props.shapeProperties.selected)
    return rgbColorToString(colorStore.adjustedStrokeColor)
  return rgbColorToString(props.shape.strokeColor)
})

let strokeColorOpacity = computed(() => {
  if (colorStore.adjustedStrokeColor && props.shapeProperties.selected)
    return colorStore.adjustedStrokeColor.opacity
  return props.shape.strokeColor.opacity
})

let fillColor = computed(() => {
  if (colorStore.adjustedFillColor && props.shapeProperties.selected)
    return rgbColorToString(colorStore.adjustedFillColor)
  return rgbColorToString(props.shape.fillColor)
})

let fillColorOpacity = computed(() => {
  if (colorStore.adjustedFillColor && props.shapeProperties.selected)
    return colorStore.adjustedFillColor.opacity
  return props.shape.fillColor.opacity
})
</script>

<template>
  <component
    :is="getShapeComponent(props.shape)"
    :shape-prop="props.shape"
    :shape-properties="props.shapeProperties"
    :stroke="strokeColor"
    :stroke-opacity="strokeColorOpacity"
    :fill="fillColor"
    :fill-opacity="fillColorOpacity"
  />
</template>
