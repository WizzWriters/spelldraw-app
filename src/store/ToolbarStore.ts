import type { ITool } from '@/common/definitions/Tool'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export const useToolbarStore = defineStore('toolbar', () => {
  const activeTool: Ref<ITool | null> = ref(null)
  const intersectingShapesIds: Ref<string[]> = ref([])
  const selectedShapesIds: Ref<string[]> = ref([])

  function appendShapeId(id: string, array: Ref<string[]>) {
    if (array.value.indexOf(id) >= 0) return
    array.value.push(id)
  }

  function removeShapeId(id: string, array: Ref<string[]>) {
    const index = array.value.indexOf(id)
    if (index < 0) return
    array.value.splice(index, 1)
  }

  function addToIntersectingShapes(id: string) {
    appendShapeId(id, intersectingShapesIds)
  }

  function removeFromIntersectingShapes(id: string) {
    removeShapeId(id, intersectingShapesIds)
  }

  function addToSelectedShapes(id: string) {
    appendShapeId(id, selectedShapesIds)
  }

  function removeFromSelectedShapes(id: string) {
    removeShapeId(id, selectedShapesIds)
  }

  function clearSelectedShapes() {
    selectedShapesIds.value = []
  }

  function clearIntersectingShapes() {
    intersectingShapesIds.value = []
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
    clearIntersectingShapes
  }
})
