import { useCanvasStore } from '@/store/CanvasStore'
import {
  useHistoryStore,
  type ShapeDrawnEvent,
  HistoryEventType
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
    }
  }

  private undoShapeDrawnEvent(event: ShapeDrawnEvent) {
    const canvasStore = useCanvasStore()
    const drawnShapeId = event.shapeId
    canvasStore.removeDrawnShapeById(drawnShapeId)
  }
}

export default new HistoryService()
