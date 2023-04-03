import Logger from 'js-logger'
import type { ILogger } from 'js-logger'
import {
  ECanvasPointerEvent,
  type ICanvas,
  type PointerEvent
} from './canvas/Canvas'
import { PointCollector } from './PointCollector'
import { Shape, type Point } from './canvas/Geometry'
import type { IPointerPosition } from './PointerTracker'

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
    this.installPointerEventHandlers()
  }

  private handlePointCollected(newPoint: Point) {
    const currentlyDrawnShape = this.getOrCreateDrawnShape()
    currentlyDrawnShape.addPoint(newPoint)
  }

  private handlePointerReleased(point: Point) {
    this.handlePointCollected(point)
    this.pointCollector.stopCollecting()
    const currentlyDrawnShape = this.getOrCreateDrawnShape()
    this.canvas.drawShape(currentlyDrawnShape)
    this.drawnShape = undefined
  }

  private handlePointerPressed(point: Point) {
    this.handlePointCollected(point)
    this.pointCollector.startCollecting()
  }

  private handlePointerEvent(
    eventType: ECanvasPointerEvent,
    event: PointerEvent
  ) {
    const pointerPosition: IPointerPosition = {
      xCoordinate: event.clientX,
      yCoordinate: event.clientY
    }
    const point = this.canvas.getPointFromPointerPosition(pointerPosition)

    switch (eventType) {
      case ECanvasPointerEvent.POINTER_DOWN:
        this.handlePointerPressed(point)
        break
      case ECanvasPointerEvent.POINTER_UP:
      case ECanvasPointerEvent.POINTER_LEFT:
        this.handlePointerReleased(point)
    }
  }

  private installPointerEventHandlers() {
    const callPointerEventHandler =
      (eventType: ECanvasPointerEvent) => (event: PointerEvent) =>
        this.handlePointerEvent(eventType, event)

    const handledEvents = [
      ECanvasPointerEvent.POINTER_DOWN,
      ECanvasPointerEvent.POINTER_UP,
      ECanvasPointerEvent.POINTER_LEFT
    ]

    for (const event of handledEvents) {
      this.canvas.atPointerEvent(event, callPointerEventHandler(event))
    }
  }

  private getOrCreateDrawnShape(): Shape {
    if (!this.drawnShape) {
      this.drawnShape = new Shape()
      return this.drawnShape
    }
    return this.drawnShape
  }
}
