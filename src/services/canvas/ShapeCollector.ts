import { PointCollector } from './PointCollector'
import type { Point } from '@/common/definitions/Geometry'
import { Polyline } from '@/common/definitions/Shape'
import { useCanvasStore } from '@/store/CanvasStore'
import type { ILogger } from 'js-logger'
import Logger from 'js-logger'

export type ShapeCollectedCallback = (shape: Polyline) => void
export type DrawingStartedCallback = () => void

export default class ShapeCollector {
  private logger: ILogger
  private canvasStore = useCanvasStore()
  private pointCollector: PointCollector

  constructor() {
    this.logger = Logger.get('ShapeCollector')
    this.pointCollector = new PointCollector()
    this.pointCollector.atPointCollected((point) => {
      this.handlePointCollected(point)
    })
  }

  private handlePointCollected(newPoint: Point) {
    if (!this.canvasStore.currentlyDrawnShape) {
      this.handleShapeNulled()
      return
    }
    const currentlyDrawnShape = this.canvasStore.currentlyDrawnShape
    currentlyDrawnShape.addPoint(newPoint)
  }

  public collectShape(endpoint?: Point): Polyline | null {
    if (!this.canvasStore.currentlyDrawnShape) {
      this.handleShapeNulled()
      return null
    }

    this.pointCollector.stopCollecting()
    if (endpoint) this.handlePointCollected(endpoint)
    const collectedShape = this.canvasStore.currentlyDrawnShape
    this.canvasStore.currentlyDrawnShape = null

    return collectedShape
  }

  public startCollecting(startpoint?: Point) {
    this.canvasStore.currentlyDrawnShape = new Polyline()
    if (startpoint) this.handlePointCollected(startpoint)
    this.pointCollector.startCollecting()
  }

  private handleShapeNulled() {
    this.pointCollector.stopCollecting()
  }
}
