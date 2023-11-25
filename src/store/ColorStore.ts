import { RgbColor } from '@/common/definitions/Color'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { useToolbarStore } from './ToolbarStore'
import { useCanvasStore } from './CanvasStore'
import lodash from 'lodash'

export const useColorStore = defineStore('color', () => {
  const selectedStrokeColor = ref(new RgbColor(0, 0, 0, 1))
  const selectedFillColor = ref(new RgbColor(0, 0, 0, 0))
  const selectedStrokeWidth = ref(1.5)

  /* Temporary colors while user adjusts them */
  const adjustedStrokeColor: Ref<RgbColor | null> = ref(null)
  const adjustedFillColor: Ref<RgbColor | null> = ref(null)
  const adjustedStrokeWidth: Ref<number | null> = ref(null)

  function setStrokeColor(color: RgbColor) {
    const toolbarStore = useToolbarStore()
    const canvasStore = useCanvasStore()
    selectedStrokeColor.value = color
    adjustedStrokeColor.value = null
    toolbarStore.foreachSelectedShape((shape) => {
      const shapeCopy = lodash.cloneDeep(shape)
      shapeCopy.strokeColor = color
      canvasStore.updateShape(shapeCopy)
    })
  }

  function setFillColor(color: RgbColor) {
    const toolbarStore = useToolbarStore()
    const canvasStore = useCanvasStore()
    selectedFillColor.value = color
    adjustedFillColor.value = null
    toolbarStore.foreachSelectedShape((shape) => {
      const shapeCopy = lodash.cloneDeep(shape)
      shapeCopy.fillColor = color
      canvasStore.updateShape(shapeCopy)
    })
  }

  function setStrokeWidth(width: number) {
    const toolbarStore = useToolbarStore()
    const canvasStore = useCanvasStore()
    selectedStrokeWidth.value = width
    adjustedStrokeWidth.value = null
    toolbarStore.foreachSelectedShape((shape) => {
      const shapeCopy = lodash.cloneDeep(shape)
      shapeCopy.strokeWidth = width
      canvasStore.updateShape(shapeCopy)
    })
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
