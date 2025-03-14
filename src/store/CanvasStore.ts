import type { Shape } from '@/common/definitions/Shape'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import IoConnection from '@/services/connection/IoConnection'
import ShapeSerializer from '@/common/serializers/ShapeSerializer'
import { useBoardStore } from './BoardStore'
import LocalShapeRepository from '@/repositories/local/ShapeRepository'
import CanvasBroadcastChannel, {
  ECanvasBroadcastEventType,
  type IReloadMessagePayload,
  MessageCallback
} from '@/services/canvas/CanvasBroadcastChannel'

export const useCanvasStore = defineStore('canvas', () => {
  const drawnShapes: Ref<Array<Shape>> = ref([])
  const currentlyDrawnShape: Ref<Shape | null> = ref(null)
  const canvasPosition = ref({ left: 0, top: 0 })
  const canvasOffset = ref({ x: 0, y: 0 })
  const loadedLocalBoardId: Ref<number | undefined> = ref(undefined)

  function resetPosition() {
    canvasPosition.value = { left: 0, top: 0 }
    canvasOffset.value = { x: 0, y: 0 }
  }

  async function loadFromMemory(localBoardId: number) {
    const shapeRepository = new LocalShapeRepository()

    const shapeEntries = await shapeRepository.fetchBoardShapes(localBoardId)
    const shapes = shapeEntries.map((entry) =>
      ShapeSerializer.fromPlainObject(entry.shape)
    )
    drawnShapes.value = shapes

    loadedLocalBoardId.value = localBoardId
  }

  async function addDrawnShape(shape: Shape) {
    drawnShapes.value.push(shape)
    broadcastShapeCreation(shape)
    addNewShapeToDatabase(shape)
  }

  function removeDrawnShapeById(id: string) {
    const shapeIndex = drawnShapes.value.findIndex((shape) => shape.id == id)
    if (shapeIndex < 0) return
    drawnShapes.value.splice(shapeIndex, 1)
    broadcastShapeDeletion(id)
    deleteShapeFromDatabase(id)
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
    broadcastShapeUpdate(updatedShape)
    updateShapeInDatabase(updatedShape)
  }

  function broadcastShapeCreation(shape: Shape) {
    const boardStore = useBoardStore()
    boardStore.emitEventIfConnected('shape_create', {
      board_id: boardStore.boardId,
      shape: ShapeSerializer.toPlainObject(shape)
    })
  }

  function broadcastShapeDeletion(shapeId: string) {
    const boardStore = useBoardStore()
    boardStore.emitEventIfConnected('shape_delete', {
      board_id: boardStore.boardId,
      shape_id: shapeId
    })
  }

  function broadcastShapeUpdate(shape: Shape) {
    const boardStore = useBoardStore()
    boardStore.emitEventIfConnected('shape_update', {
      board_id: boardStore.boardId,
      shape: ShapeSerializer.toPlainObject(shape)
    })
  }

  function addNewShapeToDatabase(shape: Shape) {
    if (!loadedLocalBoardId.value) return

    const localShapeRepository = new LocalShapeRepository()
    localShapeRepository.insert(
      loadedLocalBoardId.value!,
      ShapeSerializer.toPlainObject(shape)
    )
    emitReloadRequest()
  }

  function deleteShapeFromDatabase(shapeId: string) {
    if (!loadedLocalBoardId.value) return

    const localShapeRepository = new LocalShapeRepository()
    localShapeRepository.delete(shapeId)
    emitReloadRequest()
  }

  function updateShapeInDatabase(shape: Shape) {
    if (!loadedLocalBoardId.value) return

    const localShapeRepository = new LocalShapeRepository()
    localShapeRepository.update(shape.id, ShapeSerializer.toPlainObject(shape))
    emitReloadRequest()
  }

  /* If the local board is opened on the other tab, ask it to reload */
  function emitReloadRequest() {
    if (!loadedLocalBoardId.value) return
    CanvasBroadcastChannel.emit(ECanvasBroadcastEventType.RELOAD, {
      localBoardId: loadedLocalBoardId.value
    })
  }

  IoConnection.onEvent('shape_create', (data) => {
    const receivedShape = ShapeSerializer.fromPlainObject(data.shape)
    drawnShapes.value.push(receivedShape)
    addNewShapeToDatabase(receivedShape)
  })

  IoConnection.onEvent('shape_delete', (data) => {
    const id = data.shape_id
    const shapeIndex = drawnShapes.value.findIndex((shape) => shape.id == id)
    if (shapeIndex < 0) return
    drawnShapes.value.splice(shapeIndex, 1)
    deleteShapeFromDatabase(id)
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
      const shape = ShapeSerializer.fromPlainObject(shapePojo)
      drawnShapes.value.push(shape)
      addNewShapeToDatabase(shape)
    }
  })

  IoConnection.onEvent('shape_update', (data) => {
    const updatedShape = ShapeSerializer.fromPlainObject(data.shape)
    const shapeIndex = drawnShapes.value.findIndex(
      (shape) => shape.id == updatedShape.id
    )
    if (shapeIndex < 0) return
    drawnShapes.value[shapeIndex] = updatedShape
    updateShapeInDatabase(updatedShape)
  })

  const reloadCallback = new MessageCallback<IReloadMessagePayload>(
    (payload) => {
      if (loadedLocalBoardId.value == payload.localBoardId)
        loadFromMemory(loadedLocalBoardId.value)
    }
  )
  CanvasBroadcastChannel.on(ECanvasBroadcastEventType.RELOAD, reloadCallback)

  return {
    drawnShapes,
    currentlyDrawnShape,
    canvasPosition,
    canvasOffset,
    resetPosition,
    loadFromMemory,
    removeDrawnShapeById,
    addDrawnShape,
    getShapeById,
    updateShape
  }
})
