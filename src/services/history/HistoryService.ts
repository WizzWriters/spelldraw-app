import { useCanvasStore } from '@/store/CanvasStore'
import {
  useHistoryStore,
  type ShapeDrawnEvent,
  HistoryEventType,
  type ShapeDeletedEvent,
  type HistoryEvent,
  type ShapesReplacedEvent
} from '@/store/HistoryStore'

class HistoryService {
  public undo() {
    const historyStore = useHistoryStore()
    const lastEvent = historyStore.popEvent()
    if (!lastEvent) return
    this.undoEvent(lastEvent)
  }

  public redo() {
    const historyStore = useHistoryStore()
    const revertedEvent = historyStore.unpopEvent()
    if (!revertedEvent) return
    this.redoEvent(revertedEvent)
  }

  private undoEvent(event: HistoryEvent) {
    switch (event.type) {
      case HistoryEventType.SHAPE_DRAWN:
        this.undoShapeDrawnEvent(event)
        break
      case HistoryEventType.SHAPE_DELETED:
        this.undoShapeDeletedEvent(event)
        break
      case HistoryEventType.SHAPES_REPLACED:
        this.undoShapesReplacement(event)
        break
    }
  }

  private redoEvent(event: HistoryEvent) {
    switch (event.type) {
      case HistoryEventType.SHAPE_DRAWN:
        this.redoShapeDrawnEvent(event)
        break
      case HistoryEventType.SHAPE_DELETED:
        this.redoShapeDeletedEvent(event)
        break
      case HistoryEventType.SHAPES_REPLACED:
        this.redoShapesReplacement(event)
        break
    }
  }

  private undoShapeDrawnEvent(event: ShapeDrawnEvent) {
    const canvasStore = useCanvasStore()
    const drawnShapeId = event.shape.id
    canvasStore.removeDrawnShapeById(drawnShapeId, true, false)
  }

  private redoShapeDrawnEvent(event: ShapeDrawnEvent) {
    const canvasStore = useCanvasStore()
    canvasStore.addDrawnShape(event.shape, true, false)
  }

  private undoShapeDeletedEvent(event: ShapeDeletedEvent) {
    const canvasStore = useCanvasStore()
    canvasStore.addDrawnShape(event.shape, true, false)
  }

  private redoShapeDeletedEvent(event: ShapeDeletedEvent) {
    const canvasStore = useCanvasStore()
    const deletedShapeId = event.shape.id
    canvasStore.removeDrawnShapeById(deletedShapeId, true, false)
  }

  private undoShapesReplacement(event: ShapesReplacedEvent) {
    const canvasStore = useCanvasStore()
    canvasStore.removeDrawnShapeById(event.newShape.id, true, false)
    for (const shape of event.oldShapes) {
      canvasStore.addDrawnShape(shape, true, false)
    }
  }

  private redoShapesReplacement(event: ShapesReplacedEvent) {
    const canvasStore = useCanvasStore()
    canvasStore.replaceShapes(event.oldShapes, event.newShape, true, false)
  }
}

export default new HistoryService()
