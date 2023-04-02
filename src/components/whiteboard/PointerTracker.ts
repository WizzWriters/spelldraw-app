import {
  ECanvasPointerEvent,
  type ICanvas,
  type IPointerPosition,
  type PointerEvent
} from './canvas/Canvas'

export class PointerTracker {
  private pointerPosition: IPointerPosition
  private canvas: ICanvas
  private isTracking: Boolean

  constructor(canvas: ICanvas) {
    this.canvas = canvas
    this.pointerPosition = { xCoordinate: 0, yCoordinate: 0 }
    this.isTracking = false
  }

  public startPointerTracking() {
    this.canvas.atPointerEvent(ECanvasPointerEvent.POINTER_MOVED, (event) =>
      this.updatePointerPosition(event)
    )
    this.isTracking = true
  }

  public getPointerPosition(): IPointerPosition {
    if (!this.isTracking) {
      throw Error('Pointer tracking not started')
    }
    return this.pointerPosition
  }

  private updatePointerPosition(event: PointerEvent) {
    this.pointerPosition = {
      xCoordinate: event.clientX,
      yCoordinate: event.clientY
    }
  }
}
