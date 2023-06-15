import type { Shape } from '@/common/definitions/Shape'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import IoConnection from '@/services/connection/IoConnection'
import ShapeSerializer from '@/common/serializers/ShapeSerializer'
import { useBoardStore } from './BoardStore'

export const useCanvasStore = defineStore('canvas', () => {
  const boardStore = useBoardStore()

  const drawnShapes: Ref<Array<Shape>> = ref([])
  const currentlyDrawnShape: Ref<Shape | null> = ref(null)
  const canvasPosition = ref({ left: 0, top: 0 })

  function addDrawnShape(shape: Shape) {
    drawnShapes.value.push(shape)
    IoConnection.emit('new_shape', {
      board_id: boardStore.boardId,
      shape: ShapeSerializer.toJson(shape)
    })
  }

  function removeDrawnShapeById(id: string) {
    const shapeIndex = drawnShapes.value.findIndex((shape) => shape.id == id)
    if (shapeIndex < 0) return
    drawnShapes.value.splice(shapeIndex, 1)
  }

  IoConnection.onEvent('new_shape', (data) => {
    const receivedShape = ShapeSerializer.fromJson(data.shape)
    drawnShapes.value.push(receivedShape)
  })

  return {
    drawnShapes,
    currentlyDrawnShape,
    canvasPosition,
    removeDrawnShapeById,
    addDrawnShape
  }
})
