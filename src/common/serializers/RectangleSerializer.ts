import { Rectangle } from '../definitions/Geometry'

export interface IRectanglePlainObject {
  left: number
  right: number
  bottom: number
  top: number
}

export class RectangleSerializer {
  public static toPlainObject(rectangle: Rectangle): IRectanglePlainObject {
    return {
      left: rectangle.left,
      right: rectangle.right,
      bottom: rectangle.bottom,
      top: rectangle.top
    }
  }

  public static fromPlainObject(rectangle: IRectanglePlainObject) {
    return new Rectangle(
      rectangle.left,
      rectangle.right,
      rectangle.bottom,
      rectangle.top
    )
  }
}
