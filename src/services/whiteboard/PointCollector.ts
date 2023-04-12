import { PointerTracker } from './PointerTracker'
import type { ICanvas } from '../canvas/Canvas'
import type { Point } from '../canvas/Geometry'

const POINT_COLLECTION_INTERVAL = 30

export type PointCollectedCallback = (point: Point) => void

export class PointCollector {
  private canvas: ICanvas
  private pointerTracker: PointerTracker
  private callbackArray: Array<PointCollectedCallback>
  private interval?: number

  constructor(canvas: ICanvas) {
    this.canvas = canvas
    this.pointerTracker = new PointerTracker()
    this.pointerTracker.startPointerTracking()
    this.callbackArray = []
  }

  public atPointCollected(callback: PointCollectedCallback) {
    this.callbackArray.push(callback)
  }

  public startCollecting() {
    this.interval = setInterval(
      () => this.collectPoint(),
      POINT_COLLECTION_INTERVAL
    )
  }

  public stopCollecting() {
    clearInterval(this.interval)
  }

  public getPointUnderCursor(): Point {
    const pointerPosition = this.pointerTracker.getPointerPosition()
    const pointUnderCursor =
      this.canvas.getPointFromPointerPosition(pointerPosition)
    return pointUnderCursor
  }

  private collectPoint() {
    const newPoint = this.getPointUnderCursor()
    for (const callback of this.callbackArray) {
      callback(newPoint)
    }
  }
}
