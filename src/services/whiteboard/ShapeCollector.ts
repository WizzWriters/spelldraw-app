import { PointCollector } from './PointCollector'
import type { IPointerPosition } from './PointerTracker'
import { ECanvasPointerEvent, type ICanvas } from '../canvas/Canvas'
import { Polyline, type Point } from '../canvas/Geometry'
import lodash from 'lodash'

export type ShapeCollectedCallback = (shape: Polyline) => void
export type DrawingStartedCallback = () => void

export class ShapeCollector {
  private canvas: ICanvas
  private pointCollector: PointCollector
  private shapeCollectedCallbacks: Array<ShapeCollectedCallback>
  private drawingStartedCallbacks: Array<DrawingStartedCallback>
  private drawnShape?: Polyline

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

  public getCurrentlyDrawnShape(): Polyline | undefined {
    const currentlyDrawnShape = lodash.cloneDeep(this.drawnShape)
    const currentPointUnderCursor = this.pointCollector.getPointUnderCursor()
    currentlyDrawnShape?.addPoint(currentPointUnderCursor)
    return currentlyDrawnShape
  }

  private drawingStarted() {
    for (const callback of this.drawingStartedCallbacks) {
      callback()
    }
  }

  private shapeCollected(shape: Polyline) {
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
    const collectedShape = this.drawnShape
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
  private getOrCreateDrawnShape(): Polyline {
    if (!this.drawnShape) {
      this.drawnShape = new Polyline()
      return this.drawnShape
    }
    return this.drawnShape
  }
}
