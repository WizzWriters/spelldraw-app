import type { Shape } from '@/common/definitions/Shape'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import IoConnection from '@/services/connection/IoConnection'
import ShapeSerializer from '@/common/serializers/ShapeSerializer'
import { useBoardStore } from './BoardStore'

export const useCanvasStore = defineStore('canvas', () => {
  const drawnShapes: Ref<Array<Shape>> = ref([])
  const currentlyDrawnShape: Ref<Shape | null> = ref(null)
  const canvasPosition = ref({ left: 0, top: 0 })
  const canvasOffset = ref({ x: 0, y: 0 })

  function addDrawnShape(shape: Shape) {
    drawnShapes.value.push(shape)
    commitShapeCreation(shape)
  }

  function removeDrawnShapeById(id: string) {
    const shapeIndex = drawnShapes.value.findIndex((shape) => shape.id == id)
    if (shapeIndex < 0) return
    drawnShapes.value.splice(shapeIndex, 1)
    commitShapeDeletion(id)
  }

  function getShapeById(id: string) {
    const shape = drawnShapes.value.find((shape) => shape.id == id)
    return shape
  }

  function updateShape(updatedShape: Shape) {
    const shapeIndex = drawnShapes.value.findIndex(
      (shape) => shape.id == updatedShape.id
    )
    if (shapeIndex < 0) return
    drawnShapes.value[shapeIndex] = updatedShape
    commitShapeUpdate(updatedShape)
  }

  function commitShapeCreation(shape: Shape) {
    const boardStore = useBoardStore()
    boardStore.emitEventIfConnected('shape_create', {
      board_id: boardStore.boardId,
      shape: ShapeSerializer.toJson(shape)
    })
  }

  function commitShapeDeletion(shapeId: string) {
    const boardStore = useBoardStore()
    boardStore.emitEventIfConnected('shape_delete', {
      board_id: boardStore.boardId,
      shape_id: shapeId
    })
  }

  function commitShapeUpdate(shape: Shape) {
    const boardStore = useBoardStore()
    boardStore.emitEventIfConnected('shape_update', {
      board_id: boardStore.boardId,
      shape: ShapeSerializer.toJson(shape)
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
    const boardStore = useBoardStore()
    boardStore.emitEventIfConnected('shape_list_share_resp', {
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
