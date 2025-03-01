import { InvalidArguments } from '@/utils/exceptions/InvalidArguments'
import type { IPointerPosition } from './Pointer'

export class Point {
  constructor(
    public xCoordinate: number,
    public yCoordinate: number
  ) {}

  public equals(point: Point) {
    return (
      this.xCoordinate == point.xCoordinate &&
      this.yCoordinate == point.yCoordinate
    )
  }

  public add(point: Point) {
    return new Point(
      this.xCoordinate + point.xCoordinate,
      this.yCoordinate + point.yCoordinate
    )
  }

  public subtract(point: Point) {
    return new Point(
      this.xCoordinate - point.xCoordinate,
      this.yCoordinate - point.yCoordinate
    )
  }

  public divide(scalar: number) {
    return new Point(this.xCoordinate / scalar, this.yCoordinate / scalar)
  }

  public multiply(scalar: number) {
    return new Point(this.xCoordinate * scalar, this.yCoordinate * scalar)
  }

  public static fromPointerPosition(pointerPosition: IPointerPosition) {
    return new Point(pointerPosition.xCoordinate, pointerPosition.yCoordinate)
  }
}

export class Segment {
  constructor(
    public start: Point,
    public end: Point
  ) {}

  public get midpoint() {
    return this.start.add(this.end).divide(2)
  }

  public get length() {
    return Math.sqrt(this.XDifference ** 2 + this.YDifference ** 2)
  }

  public getPointAtLength(length: number) {
    const lengthFraction = length / this.length
    return new Point(
      this.start.xCoordinate + lengthFraction * this.XDifference,
      this.start.yCoordinate + lengthFraction * this.YDifference
    )
  }

  private get XDifference() {
    return this.end.xCoordinate - this.start.xCoordinate
  }

  private get YDifference() {
    return this.end.yCoordinate - this.start.yCoordinate
  }
}

export class Rectangle {
  /* We need to keep the invariant left <= right and top <= bottom */
  private _left: number
  private _right: number
  private _bottom: number
  private _top: number

  constructor(left: number, right: number, bottom: number, top: number) {
    if (left > right || bottom < top)
      throw new InvalidArguments('Rectangle constructor')
    this._left = left
    this._right = right
    this._bottom = bottom
    this._top = top
  }

  public get left() {
    return this._left
  }
  public get right() {
    return this._right
  }
  public get bottom() {
    return this._bottom
  }
  public get top() {
    return this._top
  }

  public set left(newLeft: number) {
    if (newLeft > this._right)
      throw new InvalidArguments('Rectangle set left: right < left')
    this._left = newLeft
  }

  public set right(newRight: number) {
    if (newRight < this._left)
      throw new InvalidArguments('Rectangle set right: right < left')
    this._right = newRight
  }

  public set top(newTop: number) {
    if (newTop > this._bottom)
      throw new InvalidArguments('Rectangle set top: top > bottom')
    this._top = newTop
  }

  public set bottom(newBottom: number) {
    if (newBottom < this._top)
      throw new InvalidArguments('Rectangle set bottom: top > bottom')
    this._bottom = newBottom
  }

  public get width(): number {
    return this.right - this.left
  }

  public set width(newWidth: number) {
    this.right = this.left + newWidth
  }

  public get height(): number {
    return this.bottom - this.top
  }

  public set height(newHeight: number) {
    this.bottom = this.top + newHeight
  }

  public move(xOffset: number, yOffset: number) {
    /* Cannot use setters here because rectange can become temporarily invalid
     * between those assignments */
    this._left += xOffset
    this._right += xOffset
    this._top += yOffset
    this._bottom += yOffset
  }

  public encloses(rectangle: Rectangle) {
    return (
      this.top <= rectangle.top &&
      this.bottom >= rectangle.bottom &&
      this.right >= rectangle.right &&
      this.left <= rectangle.left
    )
  }

  public contains(point: Point) {
    return (
      this.top <= point.yCoordinate &&
      this.bottom >= point.yCoordinate &&
      this.left <= point.xCoordinate &&
      this.right >= point.xCoordinate
    )
  }
}
