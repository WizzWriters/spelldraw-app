import { PointCollector } from './PointCollector'
import type { Point } from '@/common/definitions/Geometry'
import { Polyline, Shape } from '@/common/definitions/Shape'
import { useCanvasStore } from '@/store/CanvasStore'
import { useColorStore } from '@/store/ColorStore'
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
    const currentlyDrawnShape = this.canvasStore.currentlyDrawnShape as Polyline
    currentlyDrawnShape.addPoint(newPoint)
  }

  public collectShape(endpoint?: Point): Shape | null {
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
    const colorStore = useColorStore()

    this.canvasStore.currentlyDrawnShape = new Polyline(
      [],
      colorStore.selectedStrokeColor,
      colorStore.selectedFillColor,
      colorStore.selectedStrokeWidth
    )
    if (startpoint) this.handlePointCollected(startpoint)
    this.pointCollector.startCollecting()
  }

  private handleShapeNulled() {
    this.pointCollector.stopCollecting()
  }
}
