import { useCanvasStore } from '@/store/CanvasStore'
import {
  useHistoryStore,
  type ShapeDrawnEvent,
  HistoryEventType,
  type ShapeDeletedEvent
} from '@/store/HistoryStore'

class HistoryService {
  public undo() {
    const historyStore = useHistoryStore()
    const lastEvent = historyStore.popEvent()
    if (!lastEvent) return

    switch (lastEvent.type) {
      case HistoryEventType.SHAPE_DRAWN:
        this.undoShapeDrawnEvent(lastEvent)
        break
      case HistoryEventType.SHAPE_DELETED:
        this.undoShapeDeletedEvent(lastEvent)
        break
    }
  }

  public redo() {
    const historyStore = useHistoryStore()
    const revertedEvent = historyStore.unpopEvent()
    if (!revertedEvent) return

    switch (revertedEvent.type) {
      case HistoryEventType.SHAPE_DRAWN:
        this.redoShapeDrawnEvent(revertedEvent)
        break
      case HistoryEventType.SHAPE_DELETED:
        this.redoShapeDeletedEvent(revertedEvent)
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
}

export default new HistoryService()
