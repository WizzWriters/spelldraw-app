import { Segment, type Point } from '@/common/definitions/Geometry'
import { ECorrectionRequestState, useMagicStore } from '@/store/MagicStore'
import Logger from 'js-logger'

const STEP = 2
const TRIGGER_THRESHOLD = 2
const STALL_THRESHOLD = 9
const TOLARANCE = 5

export default class StallDetector {
  private logger = Logger.get('StallDetector')
  private lastPoint: Point | null = null
  private iterationsCount = 0
  private magicStore = useMagicStore()
  /* We allow for small movement around the anchor after being triggered */
  private anchorPoint: Point | null = null

  constructor() {
    this.magicStore.maxActivationStep = STALL_THRESHOLD
  }

  public feed(nextPoint: Point) {
    if (!this.lastPoint) {
      this.reset(nextPoint)
      return
    }

    if (!this.shouldReset(nextPoint)) {
      this.iterationsCount++
      this.handleIterationsCount()
      return
    }

    this.reset(nextPoint)
  }

  public reset(lastPoint?: Point) {
    this.iterationsCount = 0
    this.magicStore.shapeCorrectionState = ECorrectionRequestState.IDLE
    this.lastPoint = lastPoint || null
    this.anchorPoint = null
  }

  private handleIterationsCount() {
    const currentStep = this.iterationsCount / STEP
    if (Number.isInteger(currentStep)) {
      this.magicStore.activationStep = currentStep
    }
    if (currentStep == STALL_THRESHOLD) {
      this.stallDetected()
      return
    }
    if (currentStep == TRIGGER_THRESHOLD) {
      this.trigger()
      return
    }
  }

  /* Called when we suspect that user might be about to hold the pointer */
  private trigger() {
    this.logger.debug('Cursor stalling suspicion...')
    this.magicStore.shapeCorrectionState = ECorrectionRequestState.START
    this.anchorPoint = this.lastPoint
  }

  private stallDetected() {
    this.logger.debug('Cursor stalled!')
    this.magicStore.shapeCorrectionState = ECorrectionRequestState.COMMIT
  }

  private shouldReset(nextPoint: Point) {
    if (this.anchorPoint) return !this.compareToAnchor(nextPoint)
    return !this.compareToLastPoint(nextPoint)
  }

  private compareToLastPoint(nextPoint: Point) {
    if (
      this.lastPoint?.xCoordinate == nextPoint.xCoordinate &&
      this.lastPoint?.yCoordinate == nextPoint.yCoordinate
    ) {
      return true
    }
    return false
  }

  private compareToAnchor(nextPoint: Point) {
    const segment = new Segment(this.anchorPoint!, nextPoint)
    if (segment.length < TOLARANCE) return true
    return false
  }
}
