import { PointCollector } from './PointCollector'
import { EPointerEvent } from '@/common/definitions/Pointer'
import { Polyline, type Point } from '@/common/definitions/Geometry'
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

  constructor(canvas: HTMLElement) {
    this.logger = Logger.get('ShapeCollector')
    this.canvas = canvas
    this.shapeCollectedCallbacks = []
    this.pointCollector = new PointCollector()
    this.pointCollector.atPointCollected((point) => {
      this.handlePointCollected(point)
    })
  }

  public startCollectingShapes() {
    this.installPointerEventHandlers()
  }

  public atShapeCollected(callback: ShapeCollectedCallback) {
    this.shapeCollectedCallbacks.push(callback)
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
    this.pointCollector.startCollecting()
  }

  public handlePointerEvent(eventType: EPointerEvent, event: PointerEvent) {
    const point = this.canvasStore.getPositionOnCanvasFromPointerPosition({
      xCoordinate: event.clientX,
      yCoordinate: event.clientY
    })

    switch (eventType) {
      case EPointerEvent.POINTER_DOWN:
        this.handlePointerPressed(point)
        break
      case EPointerEvent.POINTER_UP:
      case EPointerEvent.POINTER_LEFT:
        this.handlePointerReleased(point)
        break
      default:
        this.logger.warn(`Unknown pointer event received: ${eventType}`)
    }
  }

  private installPointerEventHandlers() {
    const callPointerEventHandler =
      (eventType: EPointerEvent) => (event: PointerEvent) =>
        this.handlePointerEvent(eventType, event)

    const handledEvents = [
      EPointerEvent.POINTER_DOWN,
      EPointerEvent.POINTER_UP,
      EPointerEvent.POINTER_LEFT
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
