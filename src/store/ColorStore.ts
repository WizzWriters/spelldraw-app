import { RgbColor } from '@/common/definitions/Color'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export const useColorStore = defineStore('color', () => {
  const selectedStrokeColor = ref(new RgbColor(0, 0, 0, 1))
  const selectedFillColor = ref(new RgbColor(0, 0, 0, 0))
  const selectedStrokeWidth = ref(1.5)

  /* Temporary colors while user adjusts them */
  const adjustedStrokeColor: Ref<RgbColor | null> = ref(null)
  const adjustedFillColor: Ref<RgbColor | null> = ref(null)
  const adjustedStrokeWidth: Ref<number | null> = ref(null)

  function setStrokeColor(color: RgbColor) {
    selectedStrokeColor.value = color
    adjustedStrokeColor.value = null
  }

  function setFillColor(color: RgbColor) {
    selectedFillColor.value = color
    adjustedFillColor.value = null
  }

  function setStrokeWidth(width: number) {
    selectedStrokeWidth.value = width
    adjustedStrokeWidth.value = null
  }

  return {
    selectedStrokeColor,
    selectedFillColor,
    selectedStrokeWidth,
    adjustedStrokeColor,
    adjustedFillColor,
    adjustedStrokeWidth,
    setStrokeColor,
    setFillColor,
    setStrokeWidth
  }
})
