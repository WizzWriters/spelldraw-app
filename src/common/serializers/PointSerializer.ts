import { Point } from '../definitions/Geometry'

export interface IPointPlainObject {
  xCoordinate: number
  yCoordinate: number
}

export class PointSerializer {
  public static toPlainObject(point: Point): IPointPlainObject {
    return { xCoordinate: point.xCoordinate, yCoordinate: point.yCoordinate }
  }

  public static fromPlainObject(pointPojo: IPointPlainObject) {
    return new Point(pointPojo.xCoordinate, pointPojo.yCoordinate)
  }
}
