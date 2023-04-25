import type { IPointerPosition } from '@/services/canvas/Pointer'
import type { Polyline, Shape } from '@/services/canvas/Geometry'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export const useCanvasStore = defineStore('canvas', () => {
  const drawnShapes: Ref<Array<Shape>> = ref([])
  const currentlyDrawnShape: Ref<Polyline | null> = ref(null)

  const pointerPosition: Ref<IPointerPosition> = ref({
    xCoordinate: 0,
    yCoordinate: 0
  })

  const canvasPosition = ref({ left: 0, top: 0 })

  function getPositionOnCanvasFromPointerPosition(
    pointerPosition: IPointerPosition
  ) {
    return {
      xCoordinate: pointerPosition.xCoordinate - canvasPosition.value.left,
      yCoordinate: pointerPosition.yCoordinate - canvasPosition.value.top
    }
  }

  return {
    drawnShapes,
    currentlyDrawnShape,
    pointerPosition,
    canvasPosition,
    getPositionOnCanvasFromPointerPosition
  }
})
