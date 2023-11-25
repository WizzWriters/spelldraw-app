import { useCanvasStore } from '@/store/CanvasStore'
import {
  useHistoryStore,
  type ShapeDrawnEvent,
  HistoryEventType,
  type ShapeDeletedEvent,
  type HistoryEvent,
  type ShapesReplacedEvent,
  type ShapeUpdatedEvent,
  type AggragateEvent
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
        this.undoShapesReplacementEvent(event)
        break
      case HistoryEventType.SHAPE_UPDATED:
        this.undoShapeUpdatedEvent(event)
        break
      case HistoryEventType.AGGREGATE:
        this.undoAggregateEvent(event)
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
      case HistoryEventType.SHAPE_UPDATED:
        this.redoShapeUpdatedEvent(event)
        break
      case HistoryEventType.SHAPES_REPLACED:
        this.redoShapesReplacementEvent(event)
        break
      case HistoryEventType.AGGREGATE:
        this.redoAggregateEvent(event)
        break
    }
  }

  private undoShapeDrawnEvent(event: ShapeDrawnEvent) {
    const canvasStore = useCanvasStore()
    const drawnShapeId = event.shape.id
    canvasStore.removeDrawnShapeById(drawnShapeId, false)
  }

  private redoShapeDrawnEvent(event: ShapeDrawnEvent) {
    const canvasStore = useCanvasStore()
    canvasStore.addDrawnShape(event.shape, false)
  }

  private undoShapeDeletedEvent(event: ShapeDeletedEvent) {
    const canvasStore = useCanvasStore()
    canvasStore.addDrawnShape(event.shape, false)
  }

  private redoShapeDeletedEvent(event: ShapeDeletedEvent) {
    const canvasStore = useCanvasStore()
    const deletedShapeId = event.shape.id
    canvasStore.removeDrawnShapeById(deletedShapeId, false)
  }

  private undoShapeUpdatedEvent(event: ShapeUpdatedEvent) {
    const canvasStore = useCanvasStore()
    canvasStore.updateShape(event.oldShape, false)
  }

  private redoShapeUpdatedEvent(event: ShapeUpdatedEvent) {
    const canvasStore = useCanvasStore()
    canvasStore.updateShape(event.newShape, false)
  }

  private undoShapesReplacementEvent(event: ShapesReplacedEvent) {
    const canvasStore = useCanvasStore()
    canvasStore.removeDrawnShapeById(event.newShape.id, false)
    for (const shape of event.oldShapes) {
      canvasStore.addDrawnShape(shape, false)
    }
  }

  private redoShapesReplacementEvent(event: ShapesReplacedEvent) {
    const canvasStore = useCanvasStore()
    canvasStore.replaceShapes(event.oldShapes, event.newShape, false)
  }

  private undoAggregateEvent(event: AggragateEvent) {
    for (let i = event.events.length - 1; i >= 0; i--) {
      this.undoEvent(event.events[i])
    }
  }

  private redoAggregateEvent(event: AggragateEvent) {
    for (const e of event.events) {
      this.redoEvent(e)
    }
  }
}

export default new HistoryService()
