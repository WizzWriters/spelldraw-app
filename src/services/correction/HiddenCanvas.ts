import type { ILogger } from 'js-logger'
import Logger from 'js-logger'
import type { Polyline } from '../canvas/Geometry'

export class HiddenCanvas {
  public htmlCanvas: HTMLCanvasElement
  private logger: ILogger
  private context2d: CanvasRenderingContext2D
  private lineWidth: number

  constructor() {
    this.logger = Logger.get('HTMLCanvas')
    this.htmlCanvas = document.createElement('canvas')
    this.lineWidth = 1
    const context2d = this.htmlCanvas.getContext('2d')
    if (context2d == null) {
      throw Error('Unable to retrieve 2d context')
    }
    this.context2d = context2d
    this.context2d.fillStyle = 'black'
  }

  public drawShape(shape: Polyline) {
    const pointList = shape.getPointList()
    if (pointList.length == 0) return

    this.context2d.beginPath()
    const startingPoint = pointList[0]
    this.context2d.moveTo(startingPoint.xCoordinate, startingPoint.yCoordinate)

    for (const point of pointList.slice(1)) {
      this.context2d.lineTo(point.xCoordinate, point.yCoordinate)
    }
    this.context2d.lineWidth = this.lineWidth
    this.context2d.strokeStyle = 'white'
    this.context2d.stroke()
  }

  public resize(width: number, height: number): void {
    if (this.htmlCanvas.width != width || this.htmlCanvas.height != height) {
      this.htmlCanvas.width = width
      this.htmlCanvas.height = height
    }
  }

  public clear() {
    this.context2d.clearRect(
      0,
      0,
      this.htmlCanvas.width,
      this.htmlCanvas.height
    )
    this.context2d.fillRect(0, 0, this.htmlCanvas.width, this.htmlCanvas.height)
  }

  public setLineWidth(width: number) {
    this.lineWidth = width
  }
}
