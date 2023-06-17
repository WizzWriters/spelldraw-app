import { RgbColor } from '@/common/definitions/Color'
import type { ITool } from '@/common/definitions/Tool'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { useCanvasStore } from './CanvasStore'

export const useToolbarStore = defineStore('toolbar', () => {
  const activeTool: Ref<ITool | null> = ref(null)
  const intersectingShapesIds = ref(new Set<string>())
  const selectedShapesIds = ref(new Set<string>())
  const selectedStrokeColor = ref(new RgbColor(0, 0, 0, 1))
  const selectedFillColor = ref(new RgbColor(0, 0, 0, 0))

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

  function setStrokeColor(color: RgbColor) {
    const canvasStore = useCanvasStore()
    selectedStrokeColor.value = color
    for (const shapeId of selectedShapesIds.value) {
      const shape = canvasStore.getShapeById(shapeId)
      if (!shape) continue
      shape.strokeColor = color
      canvasStore.updateShape(shape)
    }
  }

  function setFillColor(color: RgbColor) {
    const canvasStore = useCanvasStore()
    selectedFillColor.value = color
    for (const shapeId of selectedShapesIds.value) {
      const shape = canvasStore.getShapeById(shapeId)
      if (!shape) continue
      shape.fillColor = color
      canvasStore.updateShape(shape)
    }
  }

  return {
    activeTool,
    selectedShapesIds,
    selectedStrokeColor,
    selectedFillColor,
    addToSelectedShapes,
    removeFromSelectedShapes,
    clearSelectedShapes,
    intersectingShapesIds,
    addToIntersectingShapes,
    removeFromIntersectingShapes,
    clearIntersectingShapes,
    setStrokeColor,
    setFillColor
  }
})
