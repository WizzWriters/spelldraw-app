import { PolyLineShape } from '../canvas/Geometry'
import lodash from 'lodash'

export default class ShapeNormalizer {
  constructor() {}

  public normalize(
    shape: PolyLineShape,
    maxWidth: number,
    maxHeight: number,
    padding: number
  ): PolyLineShape {
    const paddingTop = maxHeight * padding
    maxHeight -= 2 * paddingTop
    const paddingLeft = maxWidth * padding
    maxWidth -= 2 * paddingLeft

    const shapeCopy = lodash.cloneDeep(shape)
    const boundingRect = shapeCopy.getBoundingRectangle()
    shapeCopy.move(-boundingRect.left, -boundingRect.top)

    const widthFrac = maxWidth / boundingRect.width
    const heightFrac = maxHeight / boundingRect.height

    const resizedShape = this.resize(shapeCopy, Math.min(widthFrac, heightFrac))
    this.moveToCenter(resizedShape, maxWidth, maxHeight)
    resizedShape.move(paddingLeft, paddingTop)
    return resizedShape
  }

  private resize(shape: PolyLineShape, frac: number) {
    return new PolyLineShape(
      shape.getPointList().map((point) => {
        point.xCoordinate *= frac
        point.yCoordinate *= frac
        return point
      })
    )
  }

  private moveToCenter(
    shape: PolyLineShape,
    maxWidth: number,
    maxHeight: number
  ) {
    const boundingRect = shape.getBoundingRectangle()

    if (boundingRect.width < maxWidth) {
      const diff = maxWidth - boundingRect.width
      shape.move(diff / 2, 0)
    } else if (boundingRect.height < maxHeight) {
      const diff = maxHeight - boundingRect.height
      shape.move(0, diff / 2)
    }
  }
}
