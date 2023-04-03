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
    this.installPointerEventsHandlers()
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

  private handlePointerEvent(event: ECanvasPointerEvent) {
    switch (event) {
      case ECanvasPointerEvent.POINTER_DOWN:
        this.handlePointerPressed()
        break
      case ECanvasPointerEvent.POINTER_UP:
      case ECanvasPointerEvent.POINTER_LEFT:
        this.handlePointerReleased()
    }
  }

  private installPointerEventsHandlers() {
    const callPointerEventHandler = (event: ECanvasPointerEvent) => () => {
      this.handlePointerEvent(event)
    }

    const handledEvents = [
      ECanvasPointerEvent.POINTER_DOWN,
      ECanvasPointerEvent.POINTER_UP,
      ECanvasPointerEvent.POINTER_LEFT
    ]

    for (const event of handledEvents) {
      this.canvas.atPointerEvent(event, callPointerEventHandler(event))
    }
  }
}
