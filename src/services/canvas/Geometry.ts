import lodash from 'lodash'

export class Point {
  constructor(public xCoordinate: number, public yCoordinate: number) {}
}

export class Segment {
  constructor(public start: Point, public end: Point) {}

  public get midpoint() {
    return new Point(
      (this.start.xCoordinate + this.end.xCoordinate) / 2,
      (this.start.yCoordinate + this.end.yCoordinate) / 2
    )
  }
}

export abstract class Shape {}

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
  private pointList: Array<Point>

  constructor(pointList: Array<Point> = []) {
    super()
    this.pointList = lodash.cloneDeep(pointList)
  }

  public addPoint(point: Point) {
    this.pointList.push(point)
  }

  public getPointList(): Array<Point> {
    return this.pointList
  }

  public move(xOffset: number, yOffset: number) {
    this.pointList.map((point) => {
      point.xCoordinate += xOffset
      point.yCoordinate += yOffset
      return point
    })
  }

  public getBoundingRectangle(): Rectangle {
    const pointList = this.getPointList()
    if (pointList.length == 0) return new Rectangle(0, 0, 0, 0)
    const firstPoint = pointList[0]

    const boundingRectangle = new Rectangle(
      firstPoint.xCoordinate,
      firstPoint.xCoordinate,
      firstPoint.yCoordinate,
      firstPoint.yCoordinate
    )

    return pointList.reduce((rect, point) => {
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
      result.xCoordinate += point.xCoordinate / numberOfPoints
      result.yCoordinate += point.yCoordinate / numberOfPoints
      return result
    }, new Point(0, 0))
  }
}
