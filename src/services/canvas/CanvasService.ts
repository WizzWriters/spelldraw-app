import type { Shape } from '@/common/definitions/Shape'
import { useCanvasStore } from '@/store/CanvasStore'
import HistoryService from '../history/HistoryService'
import ShapeDrawnEvent from '@/store/history/event/ShapeDrawn'
import ShapeDeletedEvent from '@/store/history/event/ShapeDeleted'
import ShapeUpdatedEvent from '@/store/history/event/ShapeUpdated'

export default class CanvasService {
  public getShapeById(id: string) {
    const canvasStore = useCanvasStore()
    return canvasStore.getShapeById(id)
  }

  public drawShape(shape: Shape) {
    const canvasStore = useCanvasStore()
    HistoryService.pushEvent(new ShapeDrawnEvent(shape))
    return canvasStore.addDrawnShape(shape)
  }

  public removeShapeById(id: string) {
    const canvasStore = useCanvasStore()
    const shapeToBeRemoved = canvasStore.getShapeById(id)
    if (!shapeToBeRemoved) return
    HistoryService.pushEvent(new ShapeDeletedEvent(shapeToBeRemoved))
    return canvasStore.removeDrawnShapeById(id)
  }

  public updateShape(updatedShape: Shape) {
    const canvasStore = useCanvasStore()
    const currentState = canvasStore.getShapeById(updatedShape.id)
    if (!currentState) return
    HistoryService.pushEvent(new ShapeUpdatedEvent(currentState, updatedShape))
    return canvasStore.updateShape(updatedShape)
  }

  public replaceShapes(oldShapes: Shape[], newShape: Shape) {
    HistoryService.startAggregating()
    this.drawShape(newShape)
    for (const fragment of oldShapes) {
      this.removeShapeById(fragment.id)
    }
    HistoryService.stopAggregating()
  }

  public getCurrentlyDrawnShape() {
    const canvasStore = useCanvasStore()
    return canvasStore.currentlyDrawnShape
  }

  public setCurrentlyDrawnShape(shape: Shape | null) {
    const canvasStore = useCanvasStore()
    canvasStore.currentlyDrawnShape = shape
  }
}