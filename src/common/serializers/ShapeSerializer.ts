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
import { PointSerializer, type IPointPlainObject } from './PointSerializer'
import {
  RectangleSerializer,
  type IRectanglePlainObject
} from './RectangleSerializer'
import TextSerializer, { type ITextPlainObject } from './TextSerializer'

enum EShapeType {
  POLYLINE = 'polyline',
  POLYGON = 'polygon',
  ROUND_SHAPE = 'round',
  TEXT = 'text'
}

interface ICommonShapePlainObject {
  id: string
  type: EShapeType
  strokeColor: RgbColor
  strokeWidth: number
  fillColor: RgbColor
}

interface IPointListBasedShapePlainObject extends ICommonShapePlainObject {
  pointList: Array<IPointPlainObject>
}

class PointListBasedShapeSerializer {
  public static toPlainObject(
    shape: PointListBasedShape
  ): IPointListBasedShapePlainObject {
    let type: EShapeType
    if (shape instanceof Polyline) type = EShapeType.POLYLINE
    else if (shape instanceof Polygon) type = EShapeType.POLYGON
    else if (shape instanceof RoundShape) type = EShapeType.ROUND_SHAPE
    else throw new NotImplemented()

    const strokeColor = RgbColorSerializer.toPlainObject(shape.strokeColor)
    const fillColor = RgbColorSerializer.toPlainObject(shape.fillColor)

    const pointList = shape.pointList.map((point) =>
      PointSerializer.toPlainObject(point)
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

  public static fromPlainObject(shapePojo: IPointListBasedShapePlainObject) {
    let shape: PointListBasedShape
    const pointList = shapePojo.pointList.map((pointPojo) =>
      PointSerializer.fromPlainObject(pointPojo)
    )

    const strokeColor = RgbColorSerializer.fromPlainObject(
      shapePojo.strokeColor
    )
    const fillColor = RgbColorSerializer.fromPlainObject(shapePojo.fillColor)
    const strokeWidth = shapePojo.strokeWidth

    switch (shapePojo.type) {
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

    Object.defineProperties(shape, { id: { value: shapePojo.id } })

    return shape
  }
}

interface ITextBoxPlainObject extends ICommonShapePlainObject {
  box: IRectanglePlainObject
  text: ITextPlainObject
  textAlignment: number
}

class TextBoxSerializer {
  public static toPlainObject(textBox: TextBox): ITextBoxPlainObject {
    const strokeColor = RgbColorSerializer.toPlainObject(textBox.strokeColor)
    const fillColor = RgbColorSerializer.toPlainObject(textBox.fillColor)

    return {
      type: EShapeType.TEXT,
      id: textBox.id,
      strokeColor,
      fillColor,
      strokeWidth: textBox.strokeWidth,
      box: RectangleSerializer.toPlainObject(textBox.box),
      text: TextSerializer.toPlainObject(textBox.text),
      textAlignment: textBox.textAlignment
    }
  }

  public static fromPlainObject(textBoxPojo: ITextBoxPlainObject) {
    const strokeColor = RgbColorSerializer.fromPlainObject(
      textBoxPojo.strokeColor
    )
    const fillColor = RgbColorSerializer.fromPlainObject(textBoxPojo.fillColor)

    const textBox = new TextBox(
      RectangleSerializer.fromPlainObject(textBoxPojo.box),
      TextSerializer.fromPlainObject(textBoxPojo.text),
      textBoxPojo.textAlignment,
      strokeColor,
      fillColor
    )

    Object.defineProperties(textBox, { id: { value: textBoxPojo.id } })
    return textBox
  }
}

export type IShapePlainObject =
  | IPointListBasedShapePlainObject
  | ITextBoxPlainObject

export default class ShapeSerializer {
  static toPlainObject(shape: Shape): IShapePlainObject {
    if (shape instanceof PointListBasedShape) {
      return PointListBasedShapeSerializer.toPlainObject(shape)
    }
    if (shape instanceof TextBox) {
      return TextBoxSerializer.toPlainObject(shape)
    }
    throw new NotImplemented()
  }

  static fromPlainObject(shape: IShapePlainObject): Shape {
    switch (shape.type) {
      case EShapeType.POLYLINE:
      case EShapeType.POLYGON:
      case EShapeType.ROUND_SHAPE:
        return PointListBasedShapeSerializer.fromPlainObject(
          shape as IPointListBasedShapePlainObject
        )
      case EShapeType.TEXT:
        return TextBoxSerializer.fromPlainObject(shape as ITextBoxPlainObject)
      default:
        throw new NotImplemented()
    }
  }
}
