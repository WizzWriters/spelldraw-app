import NotImplemented from '@/utils/exceptions/NotImplemented'
import type { RgbColor } from '../definitions/Color'
import {
  PointListBasedShape,
  Polygon,
  Polyline,
  RoundShape,
  type Shape
} from '../definitions/Shape'
import { RgbColorSerializer } from './ColorSerializer'
import { PointSerializer, type IPointJson } from './PointSerializer'

enum EShapeType {
  POLYLINE = 'polyline',
  POLYGON = 'polygon',
  ROUND_SHAPE = 'round',
  TEXT = 'text'
}

export interface ICommonShapeJson {
  type: EShapeType
  strokeColor: RgbColor
  fillColor: RgbColor | null
  id: string
}

export interface IPointListBasedShapeJson extends ICommonShapeJson {
  pointList: Array<IPointJson>
}

class PointListBasedShapeSerializer {
  public static toJson(shape: PointListBasedShape): IPointListBasedShapeJson {
    let type: EShapeType
    if (shape instanceof Polyline) type = EShapeType.POLYLINE
    else if (shape instanceof Polygon) type = EShapeType.POLYGON
    else if (shape instanceof RoundShape) type = EShapeType.ROUND_SHAPE
    else throw new NotImplemented()

    const strokeColor = RgbColorSerializer.toJson(shape.strokeColor)
    const fillColor = shape.fillColor
      ? RgbColorSerializer.toJson(shape.fillColor)
      : null

    const pointList = shape.pointList.map((point) =>
      PointSerializer.toJson(point)
    )

    return {
      type,
      id: shape.id,
      strokeColor,
      fillColor,
      pointList
    }
  }

  public static fromJson(shapeJson: IPointListBasedShapeJson) {
    let shape: PointListBasedShape
    const pointList = shapeJson.pointList.map((pointJson) =>
      PointSerializer.fromJson(pointJson)
    )

    const strokeColor = RgbColorSerializer.fromJson(shapeJson.strokeColor)
    const fillColor = shapeJson.fillColor
      ? RgbColorSerializer.fromJson(shapeJson.fillColor)
      : undefined

    switch (shapeJson.type) {
      case EShapeType.POLYLINE:
        shape = new Polyline(pointList, strokeColor, fillColor)
        break
      case EShapeType.POLYGON:
        shape = new Polygon(pointList, strokeColor, fillColor)
        break
      case EShapeType.ROUND_SHAPE:
        shape = new RoundShape(pointList, strokeColor, fillColor)
        break
      default:
        throw new NotImplemented()
    }

    Object.defineProperties(shape, { id: { value: shapeJson.id } })

    return shape
  }
}

type IShapeJson = IPointListBasedShapeJson

export default class ShapeSerializer {
  static toJson(shape: Shape): IShapeJson {
    if (shape instanceof PointListBasedShape) {
      return PointListBasedShapeSerializer.toJson(shape)
    }
    throw new NotImplemented()
  }

  static fromJson(shape: IShapeJson): Shape {
    switch (shape.type) {
      case EShapeType.POLYLINE:
      case EShapeType.POLYGON:
      case EShapeType.ROUND_SHAPE:
        return PointListBasedShapeSerializer.fromJson(shape)
      default:
        throw new NotImplemented()
    }
  }
}
