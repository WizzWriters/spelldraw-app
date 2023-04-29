import type { Polyline, Shape } from '@/common/definitions/Geometry'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export const useCanvasStore = defineStore('canvas', () => {
  const drawnShapes: Ref<Array<Shape>> = ref([])
  const currentlyDrawnShape: Ref<Polyline | null> = ref(null)

  const canvasPosition = ref({ left: 0, top: 0 })

  function removeDrawnShapeById(id: string) {
    const drawnShapesLength = drawnShapes.value.length
    for (let i = 0; i < drawnShapesLength; i++) {
      if (drawnShapes.value[i].id == id) {
        drawnShapes.value.splice(i, 1)
        return
      }
    }
  }

  return {
    drawnShapes,
    currentlyDrawnShape,
    canvasPosition,
    removeDrawnShapeById
  }
})
