import { PointCollector } from './PointCollector'
import { ECanvasPointerEvent } from '../canvas/Canvas'
import { Polyline, type Point } from '../canvas/Geometry'
//import lodash from 'lodash'
import { useCanvasStore } from '@/store/CanvasStore'
import type { ILogger } from 'js-logger'
import Logger from 'js-logger'

export type ShapeCollectedCallback = (shape: Polyline) => void
export type DrawingStartedCallback = () => void

export default class ShapeCollector {
  private logger: ILogger
  private canvas: HTMLElement
  private canvasStore = useCanvasStore()
  private pointCollector: PointCollector
  private shapeCollectedCallbacks: Array<ShapeCollectedCallback>
  private drawingStartedCallbacks: Array<DrawingStartedCallback>

  constructor(canvas: HTMLElement) {
    this.logger = Logger.get('ShapeCollector')
    this.canvas = canvas
    this.shapeCollectedCallbacks = []
    this.drawingStartedCallbacks = []
    this.pointCollector = new PointCollector()
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
    if (!this.canvasStore.currentlyDrawnShape) return
    this.handlePointCollected(point)
    this.pointCollector.stopCollecting()
    const collectedShape = this.canvasStore.currentlyDrawnShape
    this.canvasStore.currentlyDrawnShape = null
    this.shapeCollected(collectedShape)
  }

  private handlePointerPressed(point: Point) {
    this.handlePointCollected(point)
    this.drawingStarted()
    this.pointCollector.startCollecting()
  }

  public handlePointerEvent(
    eventType: ECanvasPointerEvent,
    event: PointerEvent
  ) {
    const point = this.canvasStore.getPositionOnCanvasFromPointerPosition({
      xCoordinate: event.clientX,
      yCoordinate: event.clientY
    })

    switch (eventType) {
      case ECanvasPointerEvent.POINTER_DOWN:
        this.handlePointerPressed(point)
        break
      case ECanvasPointerEvent.POINTER_UP:
      case ECanvasPointerEvent.POINTER_LEFT:
        this.handlePointerReleased(point)
        break
      default:
        this.logger.warn(`Unknown pointer event received: ${eventType}`)
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
      this.canvas.addEventListener(event, callPointerEventHandler(event))
    }
  }
  private getOrCreateDrawnShape(): Polyline {
    if (!this.canvasStore.currentlyDrawnShape) {
      this.canvasStore.currentlyDrawnShape = new Polyline()
      return this.canvasStore.currentlyDrawnShape
    }
    return this.canvasStore.currentlyDrawnShape
  }
}
