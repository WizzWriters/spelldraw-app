import type { Point } from '@/common/definitions/Geometry'
import { EShapeCorrectionState, useMagicStore } from '@/store/MagicStore'
import Logger from 'js-logger'

const STEP = 2
const TRIGGER_THRESHOLD = 2
const STALL_THRESHOLD = 9

export default class StallDetector {
  private logger = Logger.get('StallDetector')
  private lastPoint: Point | null = null
  private iterationsCount = 0
  private magicStore = useMagicStore()

  constructor() {
    this.magicStore.maxActivationStep = STALL_THRESHOLD
  }

  public feed(nextPoint: Point) {
    if (!this.lastPoint) {
      this.reset(nextPoint)
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

    this.reset(nextPoint)
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

  private trigger() {
    this.logger.debug('Cursor stalling suspicion...')
    this.magicStore.shapeCorrectionState = EShapeCorrectionState.STARTED
  }

  private stallDetected() {
    this.logger.debug('Cursor stalled!')
    this.magicStore.shapeCorrectionState = EShapeCorrectionState.REQUESTED
  }

  private reset(lastPoint?: Point) {
    this.iterationsCount = 1
    this.magicStore.shapeCorrectionState = EShapeCorrectionState.IDLE
    this.lastPoint = lastPoint || null
  }
}
