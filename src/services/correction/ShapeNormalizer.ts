import { Polyline } from '@/common/definitions/Shape'
import lodash from 'lodash'

export class NormalizedShape {
  constructor(
    public offset: { x: number; y: number },
    public margin: { x: number; y: number },
    public scaleFrac: { x: number; y: number },
    public shape: Polyline
  ) {}
}

export default class ShapeNormalizer {
  constructor() {}

  public normalize(
    shape: Polyline,
    maxWidth: number,
    maxHeight: number,
    padding: number
  ): NormalizedShape {
    const [paddingTop, paddingLeft] = [maxHeight * padding, maxWidth * padding]
    maxHeight -= 2 * paddingTop
    maxWidth -= 2 * paddingLeft

    const shapeCopy = lodash.cloneDeep(shape)
    const boundingRect = shapeCopy.getBoundingRectangle()
    const [leftOffset, topOffset] = [boundingRect.left, boundingRect.top]

    shapeCopy.move(-leftOffset, -topOffset)

    const [widthFrac, heightFrac] = [
      maxWidth / boundingRect.width,
      maxHeight / boundingRect.height
    ]
    const scaleFracX = widthFrac
    const scaleFracY = heightFrac

    const resizedShape = this.resize(shapeCopy, scaleFracX, scaleFracY)
    resizedShape.move(paddingLeft, paddingTop)
    return new NormalizedShape(
      { x: leftOffset, y: topOffset },
      { x: paddingLeft, y: paddingTop },
      { x: scaleFracX, y: scaleFracY },
      resizedShape
    )
  }

  public denormalize(normalizedShape: NormalizedShape): Polyline {
    normalizedShape.shape.move(
      -normalizedShape.margin.x,
      -normalizedShape.margin.y
    )
    const resizedShape = this.resize(
      normalizedShape.shape,
      1 / normalizedShape.scaleFrac.x,
      1 / normalizedShape.scaleFrac.y
    )
    resizedShape.move(normalizedShape.offset.x, normalizedShape.offset.y)
    return resizedShape
  }

  private resize(shape: Polyline, xfrac: number, yfrac: number) {
    return new Polyline(
      shape.pointList.map((point) => {
        point.xCoordinate *= xfrac
        point.yCoordinate *= yfrac
        return point
      })
    )
  }
}
