import type { Shape } from '@/common/definitions/Shape'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import IoConnection from '@/services/connection/IoConnection'
import ShapeSerializer from '@/common/serializers/ShapeSerializer'
import { useBoardStore } from './BoardStore'
import LocalShapeRepository from '@/repositories/local/ShapeRepository'

export const useCanvasStore = defineStore('canvas', () => {
  const drawnShapes: Ref<Array<Shape>> = ref([])
  const currentlyDrawnShape: Ref<Shape | null> = ref(null)
  const canvasPosition = ref({ left: 0, top: 0 })
  const canvasOffset = ref({ x: 0, y: 0 })
  const loadedLocalBoardId: Ref<number | undefined> = ref(undefined)

  function clearCanvas() {
    drawnShapes.value = []
    canvasPosition.value = { left: 0, top: 0 }
    canvasOffset.value = { x: 0, y: 0 }
  }

  async function loadFromMemory(localBoardId: number) {
    clearCanvas()
    loadedLocalBoardId.value = localBoardId
  }

  function addDrawnShape(shape: Shape) {
    drawnShapes.value.push(shape)
    commitShapeCreation(shape)

    const localShapeRepository = new LocalShapeRepository()
    localShapeRepository.insert(
      loadedLocalBoardId.value!,
      ShapeSerializer.toPlainObject(shape)
    )
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
      shape: ShapeSerializer.toPlainObject(shape)
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
      shape: ShapeSerializer.toPlainObject(shape)
    })
  }

  IoConnection.onEvent('shape_create', (data) => {
    const receivedShape = ShapeSerializer.fromPlainObject(data.shape)
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
      shapes: drawnShapes.value.map((shape) =>
        ShapeSerializer.toPlainObject(shape)
      )
    })
  })

  IoConnection.onEvent('shape_list', (data) => {
    for (const shapePojo of data.shapes) {
      drawnShapes.value.push(ShapeSerializer.fromPlainObject(shapePojo))
    }
  })

  IoConnection.onEvent('shape_update', (data) => {
    const updatedShape = ShapeSerializer.fromPlainObject(data.shape)
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
    clearCanvas,
    loadFromMemory,
    removeDrawnShapeById,
    addDrawnShape,
    getShapeById,
    updateShape
  }
})
