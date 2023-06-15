import { Rectangle } from '../definitions/Geometry'

export interface IRectangleJson {
  left: number
  right: number
  bottom: number
  top: number
}

export class RectangleSerializer {
  public static toJson(rectangle: Rectangle): IRectangleJson {
    return {
      left: rectangle.left,
      right: rectangle.right,
      bottom: rectangle.bottom,
      top: rectangle.top
    }
  }

  public static fromJson(rectangle: IRectangleJson) {
    return new Rectangle(
      rectangle.left,
      rectangle.right,
      rectangle.bottom,
      rectangle.top
    )
  }
}
