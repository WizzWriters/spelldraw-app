import type { ILogger } from 'js-logger'
import Logger from 'js-logger'
import { Point, Shape } from './Geometry'
import type { IPointerPosition } from '../PointerTracker'

export enum ECanvasPointerEvent {
  POINTER_DOWN = 'mousedown',
  POINTER_UP = 'mouseup',
  POINTER_MOVED = 'mousemove',
  POINTER_LEFT = 'mouseleave'
}

export type PointerEvent = MouseEvent

export interface ICanvas {
  resize(width: number, height: number): void
  getCoordinates(absoluteMousePosition: IPointerPosition): Point
  atPointerEvent(
    eventType: ECanvasPointerEvent,
    callback: (event: PointerEvent) => void
  ): void
  drawShape(shape: Shape): void
}

export class HTMLCanvas implements ICanvas {
  private logger: ILogger
  private canvas: HTMLCanvasElement
  private context2d: CanvasRenderingContext2D

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.logger = Logger.get('HTMLCanvas')

    const context2d = this.canvas.getContext('2d')
    if (context2d == null) {
      throw Error('Unable to retrieve 2d context')
    }
    this.context2d = context2d
  }

  public getCoordinates(absolutePointerPosition: IPointerPosition): Point {
    const absoluteX = absolutePointerPosition.xCoordinate
    const absoluteY = absolutePointerPosition.yCoordinate
    const boundingRect = this.canvas.getBoundingClientRect()
    return new Point(
      absoluteX - boundingRect.left,
      absoluteY - boundingRect.top
    )
  }

  public resize(width: number, height: number): void {
    if (this.canvas.width != width || this.canvas.height != height) {
      this.canvas.width = width
      this.canvas.height = height
      this.logger.debug('Canvas resized to x:' + width + ' y:' + height)
    }
  }

  public atPointerEvent(
    eventType: ECanvasPointerEvent,
    callback: (event: PointerEvent) => void
  ): void {
    this.canvas.addEventListener(eventType, callback)
  }

  public drawShape(shape: Shape) {
    const pointList = shape.getPointList()
    this.context2d.beginPath()

    if (pointList.length == 0) return

    const startingPoint = pointList[0]
    this.context2d.moveTo(startingPoint.xCoordinate, startingPoint.yCoordinate)

    for (const point of pointList.slice(1)) {
      this.context2d.lineTo(point.xCoordinate, point.yCoordinate)
    }
    this.context2d.stroke()
  }
}
