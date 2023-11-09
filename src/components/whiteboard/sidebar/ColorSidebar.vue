<script setup lang="ts">
import { RgbColor } from '@/common/definitions/Color'
import { rgbColorToString } from '@/helpers/Svg'
import { useToolbarStore } from '@/store/ToolbarStore'
import { computed, ref } from 'vue'
import { ColorPicker } from 'vue-color-kit'

const toolbarStore = useToolbarStore()

const settingStroke = ref(true)
let shouldBeCommited = true

const color = computed(() => {
  if (settingStroke.value) {
    return rgbColorToString(toolbarStore.selectedStrokeColor)
  } else {
    return rgbColorToString(toolbarStore.selectedFillColor)
  }
})

const strokeWidth = computed({
  get() {
    return toolbarStore.selectedStrokeWidth.toFixed(1)
  },
  set(value) {
    toolbarStore.setStrokeWidth(parseFloat(value), shouldBeCommited)
  }
})

function colorChanged(newColor: any) {
  const { r, g, b, a } = newColor.rgba
  const rgbColor = new RgbColor(r, g, b, a)
  if (settingStroke.value) {
    toolbarStore.setStrokeColor(rgbColor, shouldBeCommited)
  } else {
    toolbarStore.setFillColor(rgbColor, shouldBeCommited)
  }
}

function handleAdjustmentStop() {
  document.removeEventListener('pointerup', handleAdjustmentStop)
  shouldBeCommited = true
  toolbarStore.commitSelectedShapes()
}

function handleAdjustmentStarted() {
  shouldBeCommited = false
  document.addEventListener('pointerup', handleAdjustmentStop)
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
        @changeColor="colorChanged"
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
        @changeColor="colorChanged"
        @pointerdown="handleAdjustmentStarted"
      />
    </div>
  </div>
</template>
