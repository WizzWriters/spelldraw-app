import type { Shape } from '@/common/definitions/Shape'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import IoConnection from '@/services/connection/IoConnection'
import ShapeSerializer from '@/common/serializers/ShapeSerializer'
import { useBoardStore } from './BoardStore'
import { HistoryEventType, useHistoryStore } from './HistoryStore'

export const useCanvasStore = defineStore('canvas', () => {
  const drawnShapes: Ref<Array<Shape>> = ref([])
  const currentlyDrawnShape: Ref<Shape | null> = ref(null)
  const canvasPosition = ref({ left: 0, top: 0 })
  const canvasOffset = ref({ x: 0, y: 0 })

  function addDrawnShape(shape: Shape) {
    const boardStore = useBoardStore()
    const historyStore = useHistoryStore()

    drawnShapes.value.push(shape)

    historyStore.pushEvent({
      type: HistoryEventType.SHAPE_DRAWN,
      shapeId: shape.id
    })
    IoConnection.emit('shape_create', {
      board_id: boardStore.boardId,
      shape: ShapeSerializer.toJson(shape)
    })
  }

  function removeDrawnShapeById(id: string) {
    const boardStore = useBoardStore()
    const shapeIndex = drawnShapes.value.findIndex((shape) => shape.id == id)
    if (shapeIndex < 0) return
    drawnShapes.value.splice(shapeIndex, 1)
    IoConnection.emit('shape_delete', {
      board_id: boardStore.boardId,
      shape_id: id
    })
  }

  function getShapeById(id: string) {
    const shape = drawnShapes.value.find((shape) => shape.id == id)
    return shape
  }

  function updateShape(updatedShape: Shape, commit: Boolean) {
    const boardStore = useBoardStore()
    const shapeIndex = drawnShapes.value.findIndex(
      (shape) => shape.id == updatedShape.id
    )
    if (shapeIndex < 0) return
    drawnShapes.value[shapeIndex] = updatedShape
    if (!commit) return

    IoConnection.emit('shape_update', {
      board_id: boardStore.boardId,
      shape: ShapeSerializer.toJson(updatedShape)
    })
  }

  IoConnection.onEvent('shape_create', (data) => {
    const receivedShape = ShapeSerializer.fromJson(data.shape)
    drawnShapes.value.push(receivedShape)
  })

  IoConnection.onEvent('shape_delete', (data) => {
    const id = data.shape_id
    const shapeIndex = drawnShapes.value.findIndex((shape) => shape.id == id)
    if (shapeIndex < 0) return
    drawnShapes.value.splice(shapeIndex, 1)
  })

  IoConnection.onEvent('shape_list_share_req', (data) => {
    IoConnection.emit('shape_list_share_resp', {
      ...data,
      shapes: drawnShapes.value.map((shape) => ShapeSerializer.toJson(shape))
    })
  })

  IoConnection.onEvent('shape_list', (data) => {
    for (const shapeJson of data.shapes) {
      drawnShapes.value.push(ShapeSerializer.fromJson(shapeJson))
    }
  })

  IoConnection.onEvent('shape_update', (data) => {
    const updatedShape = ShapeSerializer.fromJson(data.shape)
    const shapeIndex = drawnShapes.value.findIndex(
      (shape) => shape.id == updatedShape.id
    )
    if (shapeIndex < 0) return
    drawnShapes.value[shapeIndex] = updatedShape
  })

  return {
    drawnShapes,
    currentlyDrawnShape,
    canvasPosition,
    canvasOffset,
    removeDrawnShapeById,
    addDrawnShape,
    getShapeById,
    updateShape
  }
})
