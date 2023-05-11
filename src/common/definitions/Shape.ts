import lodash from 'lodash'
import { Rectangle, Point } from './Geometry'

export abstract class Shape {
  public readonly id: string = crypto.randomUUID()
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
