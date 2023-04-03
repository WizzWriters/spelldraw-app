import { PointerTracker } from './PointerTracker'
import type { ICanvas } from './canvas/Canvas'
import type { Point } from './canvas/Geometry'

export type PointCallectedCallback = (point: Point) => void

export class PointCollector {
  private canvas: ICanvas
  private pointerTracker: PointerTracker
  private callbackArray: Array<PointCallectedCallback>
  private interval?: number

  constructor(canvas: ICanvas) {
    this.canvas = canvas
    this.pointerTracker = new PointerTracker()
    this.pointerTracker.startPointerTracking()
    this.callbackArray = []
  }

  public atPointCollected(callback: PointCallectedCallback) {
    this.callbackArray.push(callback)
  }

  public startCollecting() {
    this.interval = setInterval(() => this.collectPoint(), 20)
  }

  public stopCollecting() {
    clearInterval(this.interval)
  }

  private collectPoint() {
    const pointerPosition = this.pointerTracker.getPointerPosition()
    const newPoint = this.canvas.getPointFromPointerPosition(pointerPosition)
    for (const callback of this.callbackArray) {
      callback(newPoint)
    }
  }
}
