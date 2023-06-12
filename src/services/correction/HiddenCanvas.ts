import type { ILogger } from 'js-logger'
import Logger from 'js-logger'
import {
  Polygon,
  Polyline,
  RoundShape,
  type Shape
} from '@/common/definitions/Shape'
import BezierShapeSmoother, {
  LinearBezierCurve,
  type BezierCurve,
  QuadraticBezierCurve,
  CubicBezierCurve
} from '../smoothing/BezierShapeSmoother'
import NotImplemented from '@/utils/exceptions/NotImplemented'

export class HiddenCanvas {
  public htmlCanvas: HTMLCanvasElement
  private logger: ILogger
  private context2d: CanvasRenderingContext2D
  private lineWidth: number

  constructor(width: number, height: number) {
    this.logger = Logger.get('HTMLCanvas')
    this.htmlCanvas = document.createElement('canvas')
    this.htmlCanvas.width = width
    this.htmlCanvas.height = height
    this.lineWidth = 1
    const context2d = this.htmlCanvas.getContext('2d')
    if (context2d == null) {
      throw Error('Unable to retrieve 2d context')
    }
    this.context2d = context2d
    this.context2d.fillStyle = 'black'
    this.clear()
  }

  public drawShape(shape: Shape) {
    if (shape instanceof Polyline) this.drawPolylineShape(shape)
    else if (shape instanceof Polygon) this.drawPolygon(shape)
    else if (shape instanceof RoundShape) this.drawRoundShape(shape)
    else throw new NotImplemented()
  }

  private drawRoundShape(shape: RoundShape) {
    const startingPoint = shape.pointList[0]
    const numberOfPoints = shape.pointList.length

    this.context2d.beginPath()
    this.context2d.moveTo(startingPoint.xCoordinate, startingPoint.yCoordinate)
    for (let i = 0; i < numberOfPoints; i++) {
      const startPoint = shape.pointList[i]
      const nextPoint = shape.pointList[(i + 1) % numberOfPoints]
      const controlPoint = startPoint.add(nextPoint).subtract(shape.centroid)
      const quadraticCurve = new QuadraticBezierCurve(
        startPoint,
        [controlPoint],
        nextPoint
      )
      this.traceQuadraticBezierCurve(quadraticCurve)
    }
    this.context2d.stroke()
  }

  private drawPolygon(shape: Polygon) {
    const startingPoint = shape.pointList[0]

    this.context2d.beginPath()
    this.context2d.moveTo(startingPoint.xCoordinate, startingPoint.yCoordinate)

    for (const point of [...shape.pointList].reverse()) {
      this.context2d.lineTo(point.xCoordinate, point.yCoordinate)
    }

    this.context2d.stroke()
  }

  private drawPolylineShape(shape: Polyline) {
    const pointList = shape.pointList
    if (pointList.length == 0) return

    this.context2d.beginPath()
    const bezierCurves = BezierShapeSmoother.getBezierCurves(pointList)

    if (bezierCurves.length == 0) {
      return
    }

    const startingPoint = bezierCurves[0].start
    this.context2d.moveTo(startingPoint.xCoordinate, startingPoint.yCoordinate)
    this.traceBezierCurves(bezierCurves)

    this.context2d.lineWidth = this.lineWidth
    this.context2d.strokeStyle = 'white'
    this.context2d.stroke()
  }

  private traceBezierCurves(bezierCurves: BezierCurve[]) {
    for (const bezierCurve of bezierCurves) {
      if (bezierCurve instanceof LinearBezierCurve) {
        this.traceLinearBezierCurve(bezierCurve)
        continue
      }
      if (bezierCurve instanceof QuadraticBezierCurve) {
        this.traceQuadraticBezierCurve(bezierCurve)
        continue
      }
      if (bezierCurve instanceof CubicBezierCurve) {
        this.traceCubicBezierCurve(bezierCurve)
        continue
      }
    }
  }

  private traceLinearBezierCurve(curve: LinearBezierCurve) {
    const endPoint = curve.end
    this.context2d.lineTo(endPoint.xCoordinate, endPoint.yCoordinate)
  }

  private traceQuadraticBezierCurve(curve: QuadraticBezierCurve) {
    const endPoint = curve.end
    const controlPoint = curve.controlPoints[0]
    this.context2d.quadraticCurveTo(
      controlPoint.xCoordinate,
      controlPoint.yCoordinate,
      endPoint.xCoordinate,
      endPoint.yCoordinate
    )
  }

  private traceCubicBezierCurve(curve: CubicBezierCurve) {
    const endPoint = curve.end
    const controlPoint1 = curve.controlPoints[0]
    const controlPoint2 = curve.controlPoints[1]
    this.context2d.bezierCurveTo(
      controlPoint1.xCoordinate,
      controlPoint1.yCoordinate,
      controlPoint2.xCoordinate,
      controlPoint2.yCoordinate,
      endPoint.xCoordinate,
      endPoint.yCoordinate
    )
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
