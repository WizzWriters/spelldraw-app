<script setup lang="ts">
import ToolButton from './ToolButton.vue'
import { ColorPicker } from 'vue-color-kit'
import { computed } from 'vue'
import { rgbColorToString } from '@/helpers/Svg'
import { RgbColor } from '@/common/definitions/Color'
import { useToolbarStore } from '@/store/ToolbarStore'

const props = defineProps<{
  isActive: Boolean
}>()

const emit = defineEmits(['click'])

const toolbarStore = useToolbarStore()

const color = computed(() => {
  return rgbColorToString(toolbarStore.selectedStrokeColor)
})

function colorChanged(newColor: any) {
  const { r, g, b, a } = newColor.rgba
  toolbarStore.selectedStrokeColor = new RgbColor(r, g, b, a)
}
</script>

<template>
  <div id="color-picker">
    <div v-if="props.isActive" id="picker" class="box">
      <ColorPicker
        theme="light"
        :color="color"
        :colors-default="[]"
        @changeColor="colorChanged"
      />
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
