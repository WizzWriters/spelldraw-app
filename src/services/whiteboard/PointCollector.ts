import { useCanvasStore } from '@/store/CanvasStore'
import type { Point } from '../canvas/Geometry'

const POINT_COLLECTION_INTERVAL = 30

export type PointCollectedCallback = (point: Point) => void

export class PointCollector {
  private callbackArray: Array<PointCollectedCallback>
  private interval?: number
  private canvasStore = useCanvasStore()

  constructor() {
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
    const pointUnderCursor = this.canvasStore.pointerPosition
    return pointUnderCursor
  }

  private collectPoint() {
    const newPoint = this.getPointUnderCursor()
    for (const callback of this.callbackArray) {
      callback(newPoint)
    }
  }
}
