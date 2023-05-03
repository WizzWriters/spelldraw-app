import type { Polyline, Shape } from '@/common/definitions/Geometry'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export const useCanvasStore = defineStore('canvas', () => {
  const drawnShapes: Ref<Array<Shape>> = ref([])
  const currentlyDrawnShape: Ref<Polyline | null> = ref(null)

  const canvasPosition = ref({ left: 0, top: 0 })

  function removeDrawnShapeById(id: string) {
    const shapeIndex = drawnShapes.value.findIndex((shape) => shape.id == id)
    if (shapeIndex < 0) return
    drawnShapes.value.splice(shapeIndex, 1)
  }

  return {
    drawnShapes,
    currentlyDrawnShape,
    canvasPosition,
    removeDrawnShapeById
  }
})
