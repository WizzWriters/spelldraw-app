<script setup lang="ts">
import ToolButton from './ToolButton.vue'
import { ColorPicker } from 'vue-color-kit'
import { computed, ref } from 'vue'
import { rgbColorToString } from '@/helpers/Svg'
import { RgbColor } from '@/common/definitions/Color'
import { useToolbarStore } from '@/store/ToolbarStore'

const props = defineProps<{
  isActive: Boolean
}>()
const emit = defineEmits(['click'])
const toolbarStore = useToolbarStore()

const settingStroke = ref(true)
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
    toolbarStore.setStrokeWidth(parseFloat(value))
  }
})

function colorChanged(newColor: any) {
  const { r, g, b, a } = newColor.rgba
  if (settingStroke.value) {
    toolbarStore.setStrokeColor(new RgbColor(r, g, b, a))
  } else {
    toolbarStore.setFillColor(new RgbColor(r, g, b, a))
  }
}
</script>

<template>
  <div id="color-picker">
    <div v-if="props.isActive" id="picker" class="box px-4 pb-3 pt-2">
      <div
        :class="
          `is-flex is-size-4 is-justify-content-space-between ` +
          `mb-2 is-align-items-center`
        "
      >
        <div class="tabs mb-1">
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
        <span>
          <FontAwesomeIcon
            :icon="['far', 'circle-xmark']"
            class="closing-icon"
            @click="emit('click')"
          />
        </span>
      </div>
      <div v-if="settingStroke">
        <ColorPicker
          theme="light"
          :color="color"
          :colors-default="[]"
          @changeColor="colorChanged"
        />
        <div class="mt-1">Stroke width</div>
        <div class="is-flex is-align-items-self-end">
          <input
            id="stroke-width-slider"
            class="slider is-fullwidth is-info is-circle my-0"
            step="0.5"
            min="1"
            max="10"
            v-model="strokeWidth"
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
        />
      </div>
    </div>
    <ToolButton
      id="picker-icon"
      name="Color picker"
      :is-active="props.isActive"
      @click="emit('click')"
    >
      <FontAwesomeIcon id="tool-icon" :icon="['fas', 'palette']" />
    </ToolButton>
  </div>
</template>

<style lang="scss">
#color-picker {
  order: 0;
}
</style>
