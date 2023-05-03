import lodash from 'lodash'
import type { IPointerPosition } from './Pointer'

export class Point {
  constructor(public xCoordinate: number, public yCoordinate: number) {}

  public equals(point: Point) {
    return (
      this.xCoordinate == point.xCoordinate &&
      this.yCoordinate == point.yCoordinate
    )
  }

  public add(point: Point) {
    return new Point(
      this.xCoordinate + point.xCoordinate,
      this.yCoordinate + point.yCoordinate
    )
  }

  public subtract(point: Point) {
    return new Point(
      this.xCoordinate - point.xCoordinate,
      this.yCoordinate - point.yCoordinate
    )
  }

  public divide(scalar: number) {
    return new Point(this.xCoordinate / scalar, this.yCoordinate / scalar)
  }

  public multiply(scalar: number) {
    return new Point(this.xCoordinate * scalar, this.yCoordinate * scalar)
  }

  public static fromPointerPosition(pointerPosition: IPointerPosition) {
    return new Point(pointerPosition.xCoordinate, pointerPosition.yCoordinate)
  }
}

export class Segment {
  constructor(public start: Point, public end: Point) {}

  public get midpoint() {
    return this.start.add(this.end).divide(2)
  }

  public get length() {
    return Math.sqrt(this.XDifference ** 2 + this.YDifference ** 2)
  }

  public getPointAtLength(length: number) {
    const lengthFraction = length / this.length
    return new Point(
      this.start.xCoordinate + lengthFraction * this.XDifference,
      this.start.yCoordinate + lengthFraction * this.YDifference
    )
  }

  private get XDifference() {
    return this.end.xCoordinate - this.start.xCoordinate
  }

  private get YDifference() {
    return this.end.yCoordinate - this.start.yCoordinate
  }
}

export abstract class Shape {
  public readonly id = crypto.randomUUID()
}

export class Rectangle {
  constructor(
    public left: number,
    public right: number,
    public bottom: number,
    public top: number
  ) {}

  public get width(): number {
    return this.right - this.left
  }

  public get height(): number {
    return this.bottom - this.top
  }
}

export class Polyline extends Shape {
  public pointList: Array<Point>

  constructor(pointList: Array<Point> = []) {
    super()
    this.pointList = lodash.cloneDeep(pointList)
  }

  public addPoint(point: Point) {
    if (lodash.isEqual(point, lodash.last(this.pointList))) return
    this.pointList.push(point)
  }

  public move(xOffset: number, yOffset: number) {
    this.pointList.map((point) => {
      point.xCoordinate += xOffset
      point.yCoordinate += yOffset
      return point
    })
  }

  public getBoundingRectangle(): Rectangle {
    if (this.pointList.length == 0) return new Rectangle(0, 0, 0, 0)
    const firstPoint = this.pointList[0]

    const boundingRectangle = new Rectangle(
      firstPoint.xCoordinate,
      firstPoint.xCoordinate,
      firstPoint.yCoordinate,
      firstPoint.yCoordinate
    )

    return this.pointList.reduce((rect, point) => {
      rect.left = Math.min(rect.left, point.xCoordinate)
      rect.right = Math.max(rect.right, point.xCoordinate)
      rect.bottom = Math.max(rect.bottom, point.yCoordinate)
      rect.top = Math.min(rect.top, point.yCoordinate)
      return rect
    }, boundingRectangle)
  }
}

export class Polygon extends Shape {
  private pointList: Array<Point>

  constructor(pointList: Array<Point> = []) {
    super()
    this.pointList = lodash.cloneDeep(pointList)
  }

  public getPointList(): Array<Point> {
    return this.pointList
  }
}

export class RoundShape extends Shape {
  public pointList: Array<Point>
  public centroid: Point

  constructor(points: Array<Point>) {
    super()
    this.pointList = points
    const numberOfPoints = this.pointList.length
    this.centroid = this.pointList.reduce((result, point) => {
      return result.add(point.divide(numberOfPoints))
    }, new Point(0, 0))
  }
}
