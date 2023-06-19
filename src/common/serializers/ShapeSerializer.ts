import NotImplemented from '@/utils/exceptions/NotImplemented'
import type { RgbColor } from '../definitions/Color'
import {
  PointListBasedShape,
  Polygon,
  Polyline,
  RoundShape,
  TextBox,
  type Shape
} from '../definitions/Shape'
import { RgbColorSerializer } from './ColorSerializer'
import { PointSerializer, type IPointJson } from './PointSerializer'
import { RectangleSerializer, type IRectangleJson } from './RectangleSerializer'
import TextSerializer, { type ITextJson } from './TextSerializer'

enum EShapeType {
  POLYLINE = 'polyline',
  POLYGON = 'polygon',
  ROUND_SHAPE = 'round',
  TEXT = 'text'
}

interface ICommonShapeJson {
  id: string
  type: EShapeType
  strokeColor: RgbColor
  strokeWidth: number
  fillColor: RgbColor
}

interface IPointListBasedShapeJson extends ICommonShapeJson {
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
    const fillColor = RgbColorSerializer.toJson(shape.fillColor)

    const pointList = shape.pointList.map((point) =>
      PointSerializer.toJson(point)
    )

    return {
      type,
      id: shape.id,
      strokeColor,
      fillColor,
      strokeWidth: shape.strokeWidth,
      pointList
    }
  }

  public static fromJson(shapeJson: IPointListBasedShapeJson) {
    let shape: PointListBasedShape
    const pointList = shapeJson.pointList.map((pointJson) =>
      PointSerializer.fromJson(pointJson)
    )

    const strokeColor = RgbColorSerializer.fromJson(shapeJson.strokeColor)
    const fillColor = RgbColorSerializer.fromJson(shapeJson.fillColor)
    const strokeWidth = shapeJson.strokeWidth

    switch (shapeJson.type) {
      case EShapeType.POLYLINE:
        shape = new Polyline(pointList, strokeColor, fillColor, strokeWidth)
        break
      case EShapeType.POLYGON:
        shape = new Polygon(pointList, strokeColor, fillColor, strokeWidth)
        break
      case EShapeType.ROUND_SHAPE:
        shape = new RoundShape(pointList, strokeColor, fillColor, strokeWidth)
        break
      default:
        throw new NotImplemented()
    }

    Object.defineProperties(shape, { id: { value: shapeJson.id } })

    return shape
  }
}

interface ITextBoxJson extends ICommonShapeJson {
  box: IRectangleJson
  text: ITextJson
  textAlignment: number
}

class TextBoxSerializer {
  public static toJson(textBox: TextBox): ITextBoxJson {
    const strokeColor = RgbColorSerializer.toJson(textBox.strokeColor)
    const fillColor = RgbColorSerializer.toJson(textBox.fillColor)

    return {
      type: EShapeType.TEXT,
      id: textBox.id,
      strokeColor,
      fillColor,
      strokeWidth: textBox.strokeWidth,
      box: RectangleSerializer.toJson(textBox.box),
      text: TextSerializer.toJson(textBox.text),
      textAlignment: textBox.textAlignment
    }
  }

  public static fromJson(textBoxJson: ITextBoxJson) {
    const strokeColor = RgbColorSerializer.fromJson(textBoxJson.strokeColor)
    const fillColor = RgbColorSerializer.fromJson(textBoxJson.fillColor)

    const textBox = new TextBox(
      RectangleSerializer.fromJson(textBoxJson.box),
      TextSerializer.fromJson(textBoxJson.text),
      textBoxJson.textAlignment,
      strokeColor,
      fillColor
    )

    Object.defineProperties(textBox, { id: { value: textBoxJson.id } })
    return textBox
  }
}

export type IShapeJson = IPointListBasedShapeJson | ITextBoxJson

export default class ShapeSerializer {
  static toJson(shape: Shape): IShapeJson {
    if (shape instanceof PointListBasedShape) {
      return PointListBasedShapeSerializer.toJson(shape)
    }
    if (shape instanceof TextBox) {
      return TextBoxSerializer.toJson(shape)
    }
    throw new NotImplemented()
  }

  static fromJson(shape: IShapeJson): Shape {
    switch (shape.type) {
      case EShapeType.POLYLINE:
      case EShapeType.POLYGON:
      case EShapeType.ROUND_SHAPE:
        return PointListBasedShapeSerializer.fromJson(
          shape as IPointListBasedShapeJson
        )
      case EShapeType.TEXT:
        return TextBoxSerializer.fromJson(shape as ITextBoxJson)
      default:
        throw new NotImplemented()
    }
  }
}
