import { Rectangle } from './Geometry'
import type { Shape } from './Shape'

export default class ComplexShape {
  constructor(public fragments: Array<Shape>) {}

  public getBoundingRectangle(): Rectangle {
    if (this.fragments.length == 0) return new Rectangle(0, 0, 0, 0)
    const boundingRectangle = this.fragments[0].getBoundingRectangle()

    return this.fragments.reduce((rect, shape) => {
      const shapeBouningRect = shape.getBoundingRectangle()
      rect.left = Math.min(rect.left, shapeBouningRect.left)
      rect.right = Math.max(rect.right, shapeBouningRect.right)
      rect.bottom = Math.max(rect.bottom, shapeBouningRect.bottom)
      rect.top = Math.min(rect.top, boundingRectangle.top)
      return rect
    }, boundingRectangle)
  }

  public move(xOffset: number, yOffset: number) {
    this.fragments.forEach((shape) => {
      shape.move(xOffset, yOffset)
    })
  }

  public squeeze(xFraction: number, yFraction: number) {
    this.fragments.forEach((shape) => {
      shape.squeeze(xFraction, yFraction)
    })
  }
}
