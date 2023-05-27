<script setup lang="ts">
import { Rectangle } from '@/common/definitions/Geometry'
import { ETextAlignment, type TextBox } from '@/common/definitions/Shape'
import { rgbColorToString } from '@/helpers/Svg'
import {
  computed,
  onMounted,
  ref,
  toRef,
  type Ref,
  type SVGAttributes
} from 'vue'
import { useIntersectionDetection } from './composables/useIntersectionDetection'

const props = defineProps<{
  shapeProp: any
  highlighted: Boolean
  collisionsEnabled: Boolean
}>()

const shape = toRef(props, 'shapeProp') as Ref<TextBox>
const textElementRef: Ref<SVGTextElement | null> = ref(null)

function getBaselineAlignment(
  textAlignment: ETextAlignment
): SVGAttributes['alignment-baseline'] {
  switch (textAlignment) {
    case ETextAlignment.CENTER:
      return 'central'
  }
}

const xMargin = computed(() => {
  if (!textElementRef.value) return 0
  const boundingBox = textElementRef.value.getBBox()
  if (boundingBox.width < shape.value.box.width) {
    return (shape.value.box.width - boundingBox.width) / 2
  }
  return 0
})

onMounted(() => {
  const textElement = textElementRef.value
  if (!textElement) throw new Error('Text element is missing!')

  const bouningBox = textElement.getBBox()
  const newBox = new Rectangle(
    Math.min(bouningBox.x, shape.value.box.left),
    Math.max(bouningBox.x + bouningBox.width, shape.value.box.right),
    Math.max(bouningBox.y + bouningBox.height, shape.value.box.bottom),
    Math.min(bouningBox.y, shape.value.box.bottom)
  )
  shape.value.box = newBox
})

useIntersectionDetection(
  textElementRef,
  toRef(props, 'shapeProp'),
  toRef(props, 'collisionsEnabled')
)
</script>

<template>
  <g>
    <!-- This rect will be used in Text tool -->
    <rect
      v-if="props.highlighted"
      :x="shape.box.left"
      :y="shape.box.top"
      :width="shape.box.width"
      :height="shape.box.height"
      stroke-dasharray="5, 5"
    />
    <text
      class="textbox"
      :x="shape.box.left + xMargin"
      :y="shape.box.top + shape.box.height / 2"
      :font-size="shape.text.fontSize"
      font-weight="lighter"
      ref="textElementRef"
      :fill="rgbColorToString(shape.text.fillColor)"
      :stroke="rgbColorToString(shape.text.strokeColor)"
      :filter="props.highlighted ? 'url(#neon-glow)' : ''"
    >
      <tspan :alignment-baseline="getBaselineAlignment(shape.textAlignment)">
        {{ shape.text.textValue }}
      </tspan>
    </text>
  </g>
</template>

<style lang="scss">
.textbox {
  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;
}
</style>
