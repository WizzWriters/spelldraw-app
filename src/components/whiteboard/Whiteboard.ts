import Logger from 'js-logger'
import type { ILogger } from 'js-logger'
import { ECanvasPointerEvent, type ICanvas } from './canvas/Canvas'
import { PointCollector } from './PointCollector'
import { Shape, type Point } from './canvas/Geometry'

export default class Whiteboard {
  private logger: ILogger
  private canvas: ICanvas
  private pointCollector: PointCollector
  private drawnShape?: Shape

  constructor(canvas: ICanvas) {
    this.canvas = canvas
    this.logger = Logger.get('Whiteboard')
    this.pointCollector = new PointCollector(this.canvas)
    this.pointCollector.atPointCollected((point) => {
      this.handlePointCollected(point)
    })

    this.canvas.atPointerEvent(ECanvasPointerEvent.POINTER_DOWN, () => {
      this.handlePointerPressed()
    })

    this.canvas.atPointerEvent(ECanvasPointerEvent.POINTER_UP, () => {
      this.handlePointerReleased()
    })

    this.canvas.atPointerEvent(ECanvasPointerEvent.POINTER_LEFT, () => {
      this.handlePointerReleased()
    })
  }

  private handlePointCollected(newPoint: Point) {
    if (!this.drawnShape) {
      this.drawnShape = new Shape()
    }
    this.drawnShape.addPoint(newPoint)
  }

  private handlePointerReleased() {
    this.pointCollector.stopCollecting()

    if (!this.drawnShape) {
      this.logger.warn('No shape drawn')
      return
    }

    this.canvas.drawShape(this.drawnShape)
    this.drawnShape = undefined
  }

  private handlePointerPressed() {
    this.pointCollector.startCollecting()
  }
}
