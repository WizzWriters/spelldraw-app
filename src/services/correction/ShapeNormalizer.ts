import type { Shape } from '@/common/definitions/Shape'
import lodash from 'lodash'

export class NormalizedShape {
  constructor(
    public offset: { x: number; y: number },
    public padding: { x: number; y: number },
    public scaleFrac: { x: number; y: number },
    public shape: Shape
  ) {}
}

export default class ShapeNormalizer {
  constructor() {}

  public normalize(
    shape: Shape,
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

    const [scaleFracX, scaleFracY] = [
      maxWidth / boundingRect.width,
      maxHeight / boundingRect.height
    ]

    shapeCopy.squeeze(scaleFracX, scaleFracY)
    shapeCopy.move(paddingLeft, paddingTop)
    return new NormalizedShape(
      { x: leftOffset, y: topOffset },
      { x: paddingLeft, y: paddingTop },
      { x: scaleFracX, y: scaleFracY },
      shapeCopy
    )
  }

  public denormalize(normalizedShape: NormalizedShape): Shape {
    normalizedShape.shape.move(
      -normalizedShape.padding.x,
      -normalizedShape.padding.y
    )
    normalizedShape.shape.squeeze(
      1 / normalizedShape.scaleFrac.x,
      1 / normalizedShape.scaleFrac.y
    )
    normalizedShape.shape.move(
      normalizedShape.offset.x,
      normalizedShape.offset.y
    )
    return normalizedShape.shape
  }
}
