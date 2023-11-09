import { RgbColor } from '@/common/definitions/Color'
import type { ITool } from '@/common/definitions/Tool'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { useCanvasStore } from './CanvasStore'
import type { Shape } from '@/common/definitions/Shape'

export const useToolbarStore = defineStore('toolbar', () => {
  const activeTool: Ref<ITool | null> = ref(null)
  const intersectingShapesIds = ref(new Set<string>())
  const selectedShapesIds = ref(new Set<string>())
  const selectedStrokeColor = ref(new RgbColor(0, 0, 0, 1))
  const selectedFillColor = ref(new RgbColor(0, 0, 0, 0))
  const selectedStrokeWidth = ref(1.5)

  function addShapeId(id: string, idSet: Ref<Set<string>>) {
    idSet.value.add(id)
  }

  function removeShapeId(id: string, idSet: Ref<Set<string>>) {
    idSet.value.delete(id)
  }

  function clearShapeIds(idSet: Ref<Set<string>>) {
    idSet.value.clear()
  }

  function addToIntersectingShapes(id: string) {
    addShapeId(id, intersectingShapesIds)
  }

  function removeFromIntersectingShapes(id: string) {
    removeShapeId(id, intersectingShapesIds)
  }

  function addToSelectedShapes(id: string) {
    addShapeId(id, selectedShapesIds)
  }

  function removeFromSelectedShapes(id: string) {
    removeShapeId(id, selectedShapesIds)
  }

  function clearSelectedShapes() {
    clearShapeIds(selectedShapesIds)
  }

  function clearIntersectingShapes() {
    clearShapeIds(intersectingShapesIds)
  }

  function foreachSelectedShape(callback: (shape: Shape) => void) {
    const canvasStore = useCanvasStore()
    for (const shapeId of selectedShapesIds.value) {
      const shape = canvasStore.getShapeById(shapeId)
      if (!shape) continue
      callback(shape)
    }
  }

  function setStrokeColor(color: RgbColor, commit = true) {
    const canvasStore = useCanvasStore()
    selectedStrokeColor.value = color
    foreachSelectedShape((shape) => {
      shape.strokeColor = color
      canvasStore.updateShape(shape, commit)
    })
  }

  function setFillColor(color: RgbColor, commit = true) {
    const canvasStore = useCanvasStore()
    selectedFillColor.value = color
    foreachSelectedShape((shape) => {
      shape.fillColor = color
      canvasStore.updateShape(shape, commit)
    })
  }

  function setStrokeWidth(strokeWidth: number, commit = true) {
    const canvasStore = useCanvasStore()
    selectedStrokeWidth.value = strokeWidth
    foreachSelectedShape((shape) => {
      shape.strokeWidth = strokeWidth
      canvasStore.updateShape(shape, commit)
    })
  }

  function commitSelectedShapes() {
    const canvasStore = useCanvasStore()
    foreachSelectedShape((shape) => {
      canvasStore.updateShape(shape, true)
    })
  }

  return {
    activeTool,
    selectedShapesIds,
    selectedStrokeColor,
    selectedFillColor,
    selectedStrokeWidth,
    addToSelectedShapes,
    removeFromSelectedShapes,
    clearSelectedShapes,
    intersectingShapesIds,
    addToIntersectingShapes,
    removeFromIntersectingShapes,
    clearIntersectingShapes,
    setStrokeColor,
    setFillColor,
    setStrokeWidth,
    commitSelectedShapes
  }
})
