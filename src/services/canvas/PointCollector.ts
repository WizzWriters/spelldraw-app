import type { Point } from '@/common/definitions/Geometry'
import { getPositionOnCanvas } from '@/helpers/CanvasHelper'
import { usePointerStore } from '@/store/PointerStore'
import StallDetector from './StallDetector'

const POINT_COLLECTION_INTERVAL = 30

export type PointCollectedCallback = (point: Point) => void

export class PointCollector {
  private callbackArray: Array<PointCollectedCallback> = []
  private interval?: number
  private pointerStore = usePointerStore()
  private stallDetector = new StallDetector()

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
    const pointUnderCursor = getPositionOnCanvas(
      this.pointerStore.pointerPosition
    )
    return pointUnderCursor
  }

  private collectPoint() {
    const newPoint = this.getPointUnderCursor()
    this.stallDetector.feed(newPoint)
    for (const callback of this.callbackArray) {
      callback(newPoint)
    }
  }
}
