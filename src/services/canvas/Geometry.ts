export class Point {
  constructor(public xCoordinate: number, public yCoordinate: number) {}
}

export class Segment {
  constructor(public endpoint1: Point, public endpoint2: Point) {}
}

export class Shape {
  private pointList: Array<Point>
  constructor(pointList: Array<Point> = []) {
    this.pointList = structuredClone(pointList)
  }

  public addPoint(point: Point) {
    this.pointList.push(point)
  }

  public getPointList(): Array<Point> {
    return this.pointList
  }

  public isEmpty(): Boolean {
    return this.pointList.length == 0
  }
}
