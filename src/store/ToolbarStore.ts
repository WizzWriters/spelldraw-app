import type { Segment } from '@/common/definitions/Geometry'
import type { ITool } from '@/common/definitions/Tool'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export const useToolbarStore = defineStore('toolbar', () => {
  const activeTool: Ref<ITool | null> = ref(null)
  const pointerHitline: Ref<Segment | null> = ref(null)
  const intersectingShapesIds: Ref<string[]> = ref([])

  function addToIntersectingShapes(id: string) {
    if (intersectingShapesIds.value.indexOf(id) >= 0) return
    intersectingShapesIds.value.push(id)
  }

  function removeFromIntersectingShapes(id: string) {
    const index = intersectingShapesIds.value.indexOf(id)
    if (index < 0) return
    intersectingShapesIds.value.splice(index, 1)
  }

  function clearIntersectingShapes() {
    intersectingShapesIds.value = []
  }

  return {
    activeTool,
    pointerHitline,
    intersectingShapesIds,
    addToIntersectingShapes,
    removeFromIntersectingShapes,
    clearIntersectingShapes
  }
})
