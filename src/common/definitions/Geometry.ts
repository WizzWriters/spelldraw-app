import type { IPointerPosition } from './Pointer'

export class Point {
  constructor(public xCoordinate: number, public yCoordinate: number) {}

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
  constructor(public start: Point, public end: Point) {}

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
  constructor(
    public left: number,
    public right: number,
    public bottom: number,
    public top: number
  ) {}

  public get width(): number {
    return this.right - this.left
  }

  public get height(): number {
    return this.bottom - this.top
  }
}
