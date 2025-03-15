import type ComplexShape from '@/common/definitions/ComplexShape'
import { cloneDeep } from 'lodash-es'

export class NormalizedShape {
  constructor(
    public offset: { x: number; y: number },
    public padding: { v: number; h: number },
    public margin: { x: number; y: number },
    public scaleFrac: { x: number; y: number },
    public shape: ComplexShape
  ) {}
}

export default class ShapeNormalizer {
  constructor() {}

  public normalize(
    shape: ComplexShape,
    maxSize: { width: number; height: number },
    padding: { v: number; h: number },
    keepProportions = true
  ): NormalizedShape {
    const [topPadding, leftPadding] = [
      maxSize.height * padding.v,
      maxSize.width * padding.h
    ]
    const maxHeight = maxSize.height - 2 * topPadding
    const maxWidth = maxSize.width - 2 * leftPadding

    const shapeCopy = cloneDeep(shape)
    const boundingRect = shapeCopy.getBoundingRectangle()
    const [leftOffset, topOffset] = [boundingRect.left, boundingRect.top]

    shapeCopy.move(-leftOffset, -topOffset)

    let [scaleFracX, scaleFracY] = [
      maxWidth / boundingRect.width,
      maxHeight / boundingRect.height
    ]

    if (keepProportions)
      scaleFracX = scaleFracY = Math.min(scaleFracX, scaleFracY)
    shapeCopy.squeeze(scaleFracX, scaleFracY)

    const [leftMargin, topMargin] = this.calculateMargins(
      shapeCopy,
      maxWidth,
      maxHeight
    )
    shapeCopy.move(leftPadding + leftMargin, topPadding + topMargin)

    return new NormalizedShape(
      { x: leftOffset, y: topOffset },
      { h: leftPadding, v: topPadding },
      { x: leftMargin, y: topMargin },
      { x: scaleFracX, y: scaleFracY },
      shapeCopy
    )
  }

  public denormalize(normalizedShape: NormalizedShape): ComplexShape {
    normalizedShape.shape.move(
      -(normalizedShape.padding.h + normalizedShape.margin.x),
      -(normalizedShape.padding.v + normalizedShape.margin.y)
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

  private calculateMargins(
    shape: ComplexShape,
    maxWidth: number,
    maxHeight: number
  ) {
    const boundingRect = shape.getBoundingRectangle()
    const [width, height] = [boundingRect.width, boundingRect.height]
    const xMargin = width < maxWidth ? (maxWidth - width) / 2 : 0
    const yMargin = height < maxHeight ? (maxHeight - height) / 2 : 0
    return [xMargin, yMargin]
  }
}
