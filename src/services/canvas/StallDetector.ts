import type { Point } from '@/common/definitions/Geometry'
import Logger from 'js-logger'

const TRIGGER_THRESHOLD = 5
const STALL_THRESHOLD = 30

export default class StallDetector {
  private logger = Logger.get('StallDetector')
  private lastPoint: Point | null = null
  private iterationsCount = 0

  public feed(nextPoint: Point) {
    if (!this.lastPoint) {
      this.iterationsCount = 1
      this.lastPoint = nextPoint
      return
    }

    if (
      this.lastPoint.xCoordinate == nextPoint.xCoordinate &&
      this.lastPoint.yCoordinate == nextPoint.yCoordinate
    ) {
      this.iterationsCount++
      this.handleIterationsCount()
      return
    }

    this.iterationsCount = 1
    this.lastPoint = nextPoint
  }

  private handleIterationsCount() {
    if (this.iterationsCount == STALL_THRESHOLD) {
      this.stallDetected()
      return
    }
    if (this.iterationsCount == TRIGGER_THRESHOLD) {
      this.trigger()
      return
    }
  }

  private trigger() {
    this.logger.debug('I am triggered!')
  }

  private stallDetected() {
    this.logger.debug('Stall detected!')
  }
}
