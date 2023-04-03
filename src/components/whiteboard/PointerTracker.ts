export interface IPointerPosition {
  yCoordinate: number
  xCoordinate: number
}

export class PointerTracker {
  private pointerPosition: IPointerPosition
  private isTracking: Boolean

  constructor() {
    this.pointerPosition = { xCoordinate: 0, yCoordinate: 0 }
    this.isTracking = false
  }

  public startPointerTracking() {
    document.addEventListener('mousemove', (event) =>
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

  private updatePointerPosition(event: MouseEvent) {
    this.pointerPosition = {
      xCoordinate: event.clientX,
      yCoordinate: event.clientY
    }
  }
}
