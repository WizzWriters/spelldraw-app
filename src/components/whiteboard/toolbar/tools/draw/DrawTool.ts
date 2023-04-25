import type { ITool } from '@/common/definitions/Tool'
import { EPointerEvent } from '@/common/definitions/Pointer'
import Logger from 'js-logger'
import ShapeCollector from '@/services/canvas/ShapeCollector'
import { useCanvasStore } from '@/store/CanvasStore'
import {
  AsyncInit,
  AsyncInitialized,
  RequiresAsyncInit
} from '@/utils/decorators/AsyncInit'
import ShapeCorrector from '@/services/correction/ShapeCorrector'

@AsyncInitialized
export default class DrawTool implements ITool {
  private logger = Logger.get('DrawTool')
  private canvasStore = useCanvasStore()
  private shapeCollector = new ShapeCollector()
  private shapeCorrector = new ShapeCorrector()

  @AsyncInit
  public async init() {
    await this.shapeCorrector.init()
  }

  @RequiresAsyncInit
  public handlePointerEvent(eventType: EPointerEvent, event: PointerEvent) {
    const point = this.canvasStore.getPositionOnCanvasFromPointerPosition({
      xCoordinate: event.clientX,
      yCoordinate: event.clientY
    })

    switch (eventType) {
      case EPointerEvent.POINTER_DOWN:
        this.shapeCollector.startCollecting(point)
        break
      case EPointerEvent.POINTER_UP:
      case EPointerEvent.POINTER_LEFT: {
        const collectedShape = this.shapeCollector.collectShape(point)
        if (collectedShape) this.canvasStore.drawnShapes.push(collectedShape)
        break
      }
      default:
        this.logger.warn(`Unknown pointer event received: ${eventType}`)
    }
  }
}
