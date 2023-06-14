import lodash from 'lodash'
import { Rectangle, Point } from './Geometry'
import type Text from './Text'
import { RgbColor } from './Color'

export abstract class Shape {
  public readonly id: string = crypto.randomUUID()

  constructor(
    public strokeColor: RgbColor = new RgbColor(0, 0, 0),
    public fillColor: RgbColor | null = null
  ) {}

  abstract move(xOffset: number, yOffset: number): void
  abstract squeeze(xFraction: number, yFraction: number): void
  abstract getBoundingRectangle(): Rectangle
}

export abstract class PointListBasedShape extends Shape {
  constructor(
    public pointList: Array<Point> = [],
    strokeColor?: RgbColor,
    fillColor?: RgbColor
  ) {
    super(strokeColor, fillColor)
  }

  public move(xOffset: number, yOffset: number) {
    this.pointList.map((point) => {
      point.xCoordinate += xOffset
      point.yCoordinate += yOffset
      return point
    })
  }

  public squeeze(xFraction: number, yFraction: number) {
    this.pointList.map((point) => {
      point.xCoordinate *= xFraction
      point.yCoordinate *= yFraction
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

export class Polyline extends PointListBasedShape {
  public addPoint(point: Point) {
    if (lodash.isEqual(point, lodash.last(this.pointList))) return
    this.pointList.push(point)
  }
}

export class Polygon extends PointListBasedShape {}

export class RoundShape extends PointListBasedShape {
  public get centroid() {
    const numberOfPoints = this.pointList.length
    return this.pointList.reduce((result, point) => {
      return result.add(point.divide(numberOfPoints))
    }, new Point(0, 0))
  }
}

export enum ETextAlignment {
  CENTER
}

export class TextBox extends Shape {
  constructor(
    public box: Rectangle,
    public text: Text,
    public textAlignment: ETextAlignment = ETextAlignment.CENTER,
    strokeColor?: RgbColor,
    fillColor?: RgbColor
  ) {
    super(strokeColor, fillColor)
  }

  move(xOffset: number, yOffset: number): void {
    this.box.move(xOffset, yOffset)
  }

  squeeze(xFraction: number, yFraction: number): void {
    this.box.width = this.box.width * xFraction
    this.box.height = this.box.height * yFraction
    this.text.fontSize = this.text.fontSize * yFraction
  }

  getBoundingRectangle(): Rectangle {
    return this.box
  }
}
