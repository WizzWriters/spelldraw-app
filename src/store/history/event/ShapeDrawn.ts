import { useCanvasStore } from '@/store/CanvasStore'
import type { Shape } from '@/common/definitions/Shape'
import HistoryEvent from './HistoryEvent'

export default class ShapeDrawnEvent extends HistoryEvent {
  constructor(private shape: Shape) {
    super()
  }

  public undo() {
    const canvasStore = useCanvasStore()
    const drawnShapeId = this.shape.id
    canvasStore.removeDrawnShapeById(drawnShapeId)
  }

  public redo() {
    const canvasStore = useCanvasStore()
    canvasStore.addDrawnShape(this.shape)
  }
}
