import { useCanvasStore } from '@/store/CanvasStore'
import type { Shape } from '@/common/definitions/Shape'
import HistoryEvent from './HistoryEvent'

export default class ShapeUpdatedEvent extends HistoryEvent {
  constructor(
    private oldShape: Shape,
    private newShape: Shape
  ) {
    super()
  }

  public undo() {
    const canvasStore = useCanvasStore()
    canvasStore.updateShape(this.oldShape)
  }

  public redo() {
    const canvasStore = useCanvasStore()
    canvasStore.updateShape(this.newShape)
  }
}
