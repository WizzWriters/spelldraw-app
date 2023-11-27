<script setup lang="ts">
import { RgbColor } from '@/common/definitions/Color'
import { rgbColorToString } from '@/helpers/Svg'
import ColorService from '@/services/color/ColorService'
import { useColorStore } from '@/store/ColorStore'
import { computed, ref } from 'vue'
import { ColorPicker } from 'vue-color-kit'

const colorStore = useColorStore()
const colorService = new ColorService()
const settingStroke = ref(true)

const color = computed(() => {
  if (settingStroke.value) {
    return rgbColorToString(colorStore.selectedStrokeColor)
  } else {
    return rgbColorToString(colorStore.selectedFillColor)
  }
})

const strokeWidth = computed({
  get() {
    if (colorStore.adjustedStrokeWidth)
      return colorStore.adjustedStrokeWidth.toFixed(1)
    return colorStore.selectedStrokeWidth.toFixed(1)
  },
  set(value) {
    colorStore.adjustedStrokeWidth = parseFloat(value)
  }
})

function colorAdjusted(newColor: any) {
  const { r, g, b, a } = newColor.rgba
  const rgbColor = new RgbColor(r, g, b, a)
  if (settingStroke.value) colorStore.adjustedStrokeColor = rgbColor
  else colorStore.adjustedFillColor = rgbColor
}

function handleAdjustmentStop() {
  document.removeEventListener('pointerup', handleAdjustmentStop)
  commitAdjustments()
}

function handleAdjustmentStarted() {
  document.addEventListener('pointerup', handleAdjustmentStop)
}

function commitAdjustments() {
  if (colorStore.adjustedStrokeColor)
    colorService.setStrokeColor(colorStore.adjustedStrokeColor)
  if (colorStore.adjustedFillColor)
    colorService.setFillColor(colorStore.adjustedFillColor)
  if (colorStore.adjustedStrokeWidth)
    colorService.setStrokeWidth(colorStore.adjustedStrokeWidth)
}
</script>

<template>
  <div id="color-picker">
    <div class="tabs mb-4">
      <ul>
        <li
          :class="{ 'is-active': settingStroke }"
          @click="settingStroke = true"
        >
          <a>Stroke</a>
        </li>
        <li
          :class="{ 'is-active': !settingStroke }"
          @click="settingStroke = false"
        >
          <a>Fill</a>
        </li>
      </ul>
    </div>
    <div v-if="settingStroke">
      <ColorPicker
        theme="light"
        :color="color"
        :colors-default="[]"
        @changeColor="colorAdjusted"
        @pointerdown="handleAdjustmentStarted"
      />
      <div class="mt-4">Stroke width</div>
      <div class="is-flex is-align-items-self-end">
        <input
          id="stroke-width-slider"
          class="slider is-fullwidth is-info is-circle my-0"
          step="0.5"
          min="1"
          max="10"
          v-model="strokeWidth"
          @pointerdown="handleAdjustmentStarted"
          type="range"
        />
        <div class="mx-2">{{ strokeWidth }}</div>
      </div>
    </div>
    <div v-else>
      <!-- It couldn't be a single picker, because it had troubles
            with switching between modes. In the future we should
            implement our own picker -->
      <ColorPicker
        theme="light"
        :color="color"
        :colors-default="[]"
        @changeColor="colorAdjusted"
        @pointerdown="handleAdjustmentStarted"
      />
    </div>
  </div>
</template>
