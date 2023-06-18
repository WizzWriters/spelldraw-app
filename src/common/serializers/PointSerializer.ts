import { Point } from '../definitions/Geometry'

export interface IPointJson {
  xCoordinate: number
  yCoordinate: number
}

export class PointSerializer {
  public static toJson(point: Point): IPointJson {
    return { xCoordinate: point.xCoordinate, yCoordinate: point.yCoordinate }
  }

  public static fromJson(pointJson: IPointJson) {
    return new Point(pointJson.xCoordinate, pointJson.yCoordinate)
  }
}
