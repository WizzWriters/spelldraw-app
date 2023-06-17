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
  toolbarStore.setStrokeColor(new RgbColor(r, g, b, a))
}
</script>

<template>
  <div id="color-picker">
    <div v-if="props.isActive" id="picker" class="box px-4 pb-3 pt-2">
      <div class="is-flex is-size-4 is-justify-content-end mb-2">
        <!-- <div class="tabs mb-1">
  <ul>
    <li class="is-active"><a>Stroke</a></li>
    <li><a>Fill</a></li>
  </ul>
</div> -->
        <span>
          <FontAwesomeIcon
            :icon="['far', 'circle-xmark']"
            class="closing-icon"
            @click="emit('click')"
          />
        </span>
      </div>
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
