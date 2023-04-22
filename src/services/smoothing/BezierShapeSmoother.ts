import { Segment, type Point } from '../canvas/Geometry'
import lodash from 'lodash'

abstract class AbstractBezierCurve<ControlPointType> {
  constructor(
    public start: Point,
    public controlPoints: ControlPointType,
    public end: Point
  ) {}
}

export class LinearBezierCurve extends AbstractBezierCurve<[]> {}
export class QuadraticBezierCurve extends AbstractBezierCurve<[Point]> {}
export class CubicBezierCurve extends AbstractBezierCurve<[Point, Point]> {}

export type BezierCurve =
  | LinearBezierCurve
  | QuadraticBezierCurve
  | CubicBezierCurve

export default class BezierShapeSmoother {
  public static getBezierCurves(pointList: Point[]): BezierCurve[] {
    const bezierSegments: BezierCurve[] = []
    let pointListCopy = lodash.cloneDeep(pointList)
    const pointListLength = pointListCopy.length
    this.makeSmoothBezierTransitions(pointListCopy)

    if (pointListLength <= 1) {
      return bezierSegments
    }

    for (let i = 1; i <= Math.ceil((pointListLength - 1) / 3); i++) {
      const chunk = lodash.take(pointListCopy, 4)
      bezierSegments.push(this.nextBezierCurve(chunk))
      pointListCopy = pointListCopy.slice(chunk.length - 1)
    }

    return bezierSegments
  }

  private static nextBezierCurve(pointList: Point[]): BezierCurve {
    const pointListLength = pointList.length
    switch (pointListLength) {
      case 2:
        return new LinearBezierCurve(pointList[0], [], pointList[1])
      case 3:
        return new QuadraticBezierCurve(
          pointList[0],
          [pointList[1]],
          pointList[2]
        )
      case 4:
        return new CubicBezierCurve(
          pointList[0],
          [pointList[1], pointList[2]],
          pointList[3]
        )
      default:
        throw Error('Wrong length of bezier segment')
    }
  }

  private static makeSmoothBezierTransitions(pointList: Array<Point>) {
    const pointListLength = pointList.length

    for (let i = 3; i < pointListLength; i += 3) {
      if (!pointList[i + 1]) break

      pointList[i] = new Segment(pointList[i - 1], pointList[i + 1]).midpoint
    }
  }
}
