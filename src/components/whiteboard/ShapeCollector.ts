import { PointCollector } from './PointCollector'
import type { IPointerPosition } from './PointerTracker'
import {
  ECanvasPointerEvent,
  type ICanvas,
  type PointerEvent
} from './canvas/Canvas'
import { Shape, type Point } from './canvas/Geometry'

export type ShapeCollectedCallback = (shape: Shape) => void

export class ShapeCollector {
  private canvas: ICanvas
  private pointCollector: PointCollector
  private callbackArray: Array<ShapeCollectedCallback>
  private drawnShape?: Shape

  constructor(canvas: ICanvas) {
    this.canvas = canvas
    this.callbackArray = []
    this.pointCollector = new PointCollector(this.canvas)
    this.pointCollector.atPointCollected((point) => {
      this.handlePointCollected(point)
    })
  }

  public startCollectingShapes() {
    this.installPointerEventHandlers()
  }

  public atShapeCollected(callback: ShapeCollectedCallback) {
    this.callbackArray.push(callback)
  }

  private shapeCollected(shape: Shape) {
    for (const callback of this.callbackArray) {
      callback(shape)
    }
  }

  private handlePointCollected(newPoint: Point) {
    const currentlyDrawnShape = this.getOrCreateDrawnShape()
    currentlyDrawnShape.addPoint(newPoint)
  }

  private handlePointerReleased(point: Point) {
    this.handlePointCollected(point)
    this.pointCollector.stopCollecting()
    const currentlyDrawnShape = this.getOrCreateDrawnShape()
    this.shapeCollected(currentlyDrawnShape)
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
