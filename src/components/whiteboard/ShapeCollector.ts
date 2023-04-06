import { PointCollector } from './PointCollector'
import type { IPointerPosition } from './PointerTracker'
import { ECanvasPointerEvent, type ICanvas } from './canvas/Canvas'
import { Shape, type Point } from './canvas/Geometry'
import lodash from 'lodash'

export type ShapeCollectedCallback = (shape: Shape) => void
export type DrawingStartedCallback = () => void

export class ShapeCollector {
  private canvas: ICanvas
  private pointCollector: PointCollector
  private shapeCollectedCallbacks: Array<ShapeCollectedCallback>
  private drawingStartedCallbacks: Array<DrawingStartedCallback>
  private drawnShape?: Shape

  constructor(canvas: ICanvas) {
    this.canvas = canvas
    this.shapeCollectedCallbacks = []
    this.drawingStartedCallbacks = []
    this.pointCollector = new PointCollector(this.canvas)
    this.pointCollector.atPointCollected((point) => {
      this.handlePointCollected(point)
    })
  }

  public startCollectingShapes() {
    this.installPointerEventHandlers()
  }

  public atDrawingStarted(callback: DrawingStartedCallback) {
    this.drawingStartedCallbacks.push(callback)
  }

  public atShapeCollected(callback: ShapeCollectedCallback) {
    this.shapeCollectedCallbacks.push(callback)
  }

  public getCurrentlyDrawnShape(): Shape | undefined {
    let currentlyDrawnShape = lodash.cloneDeep(this.drawnShape)
    let currentPointUnderCursor = this.pointCollector.getPointUnderCursor()
    currentlyDrawnShape?.addPoint(currentPointUnderCursor)
    return currentlyDrawnShape
  }

  private drawingStarted() {
    for (const callback of this.drawingStartedCallbacks) {
      callback()
    }
  }

  private shapeCollected(shape: Shape) {
    for (const callback of this.shapeCollectedCallbacks) {
      callback(shape)
    }
  }

  private handlePointCollected(newPoint: Point) {
    const currentlyDrawnShape = this.getOrCreateDrawnShape()
    currentlyDrawnShape.addPoint(newPoint)
  }

  private handlePointerReleased(point: Point) {
    if (!this.drawnShape) return
    this.handlePointCollected(point)
    this.pointCollector.stopCollecting()
    let collectedShape = this.drawnShape
    this.drawnShape = undefined
    this.shapeCollected(collectedShape)
  }

  private handlePointerPressed(point: Point) {
    this.drawingStarted()
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
