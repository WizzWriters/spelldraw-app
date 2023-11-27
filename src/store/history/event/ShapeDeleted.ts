import { useCanvasStore } from '@/store/CanvasStore'
import type { Shape } from '@/common/definitions/Shape'
import HistoryEvent from './HistoryEvent'

export default class ShapeDeletedEvent extends HistoryEvent {
  constructor(private shape: Shape) {
    super()
  }

  public undo() {
    const canvasStore = useCanvasStore()
    canvasStore.addDrawnShape(this.shape)
  }

  public redo() {
    const canvasStore = useCanvasStore()
    const deletedShapeId = this.shape.id
    canvasStore.removeDrawnShapeById(deletedShapeId)
  }
}
