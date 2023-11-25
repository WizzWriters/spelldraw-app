import { RgbColor } from '@/common/definitions/Color'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { useToolbarStore } from './ToolbarStore'
import { useCanvasStore } from './CanvasStore'
import lodash from 'lodash'
import { useHistoryStore } from './HistoryStore'

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
    const historyStore = useHistoryStore()
    selectedStrokeColor.value = color
    adjustedStrokeColor.value = null
    historyStore.startAggregating()
    toolbarStore.foreachSelectedShape((shape) => {
      const shapeCopy = lodash.cloneDeep(shape)
      shapeCopy.strokeColor = color
      canvasStore.updateShape(shapeCopy)
    })
    historyStore.stopAggregating()
  }

  function setFillColor(color: RgbColor) {
    const toolbarStore = useToolbarStore()
    const canvasStore = useCanvasStore()
    const historyStore = useHistoryStore()
    selectedFillColor.value = color
    adjustedFillColor.value = null
    historyStore.startAggregating()
    toolbarStore.foreachSelectedShape((shape) => {
      const shapeCopy = lodash.cloneDeep(shape)
      shapeCopy.fillColor = color
      canvasStore.updateShape(shapeCopy)
    })
    historyStore.stopAggregating()
  }

  function setStrokeWidth(width: number) {
    const toolbarStore = useToolbarStore()
    const canvasStore = useCanvasStore()
    const historyStore = useHistoryStore()
    selectedStrokeWidth.value = width
    adjustedStrokeWidth.value = null
    historyStore.startAggregating()
    toolbarStore.foreachSelectedShape((shape) => {
      const shapeCopy = lodash.cloneDeep(shape)
      shapeCopy.strokeWidth = width
      canvasStore.updateShape(shapeCopy)
    })
    historyStore.stopAggregating()
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
