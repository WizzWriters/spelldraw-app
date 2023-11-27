import type { ITool } from '@/common/definitions/Tool'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { useCanvasStore } from './CanvasStore'
import type { Shape } from '@/common/definitions/Shape'

export const useToolbarStore = defineStore('toolbar', () => {
  const activeTool: Ref<ITool | null> = ref(null)
  const intersectingShapesIds = ref(new Set<string>())
  const selectedShapesIds = ref(new Set<string>())

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

  return {
    activeTool,
    selectedShapesIds,
    addToSelectedShapes,
    removeFromSelectedShapes,
    clearSelectedShapes,
    intersectingShapesIds,
    addToIntersectingShapes,
    removeFromIntersectingShapes,
    clearIntersectingShapes,
    foreachSelectedShape
  }
})
