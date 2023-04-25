import { PointCollector } from './PointCollector'
import { Polyline, type Point } from '@/common/definitions/Geometry'
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
    const currentlyDrawnShape = this.getOrCreateDrawnShape()
    currentlyDrawnShape.addPoint(newPoint)
  }

  public collectShape(endpoint?: Point): Polyline | null {
    if (!this.canvasStore.currentlyDrawnShape) return null
    if (endpoint) this.handlePointCollected(endpoint)

    this.pointCollector.stopCollecting()

    const collectedShape = this.canvasStore.currentlyDrawnShape
    this.canvasStore.currentlyDrawnShape = null

    return collectedShape
  }

  public startCollecting(startpoint?: Point) {
    if (startpoint) this.handlePointCollected(startpoint)
    this.pointCollector.startCollecting()
  }

  private getOrCreateDrawnShape(): Polyline {
    if (!this.canvasStore.currentlyDrawnShape) {
      this.canvasStore.currentlyDrawnShape = new Polyline()
      return this.canvasStore.currentlyDrawnShape
    }
    return this.canvasStore.currentlyDrawnShape
  }
}
