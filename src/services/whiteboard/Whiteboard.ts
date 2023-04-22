import Logger from 'js-logger'
import type { ILogger } from 'js-logger'
import type { ICanvas } from '../canvas/Canvas'
import { ShapeCollector } from './ShapeCollector'
import type { Polyline, Shape } from '../canvas/Geometry'
import ShapeCorrector from '../correction/ShapeCorrector'
import {
  AsyncInit,
  AsyncInitialized,
  RequiresAsyncInit
} from '@/utils/decorators/AsyncInit'

const FRAME_INTERVAL = (1 / 50) * 1000

@AsyncInitialized
export default class Whiteboard {
  private logger: ILogger
  private canvas: ICanvas
  private shapeCollector: ShapeCollector
  private shapeCollection: Array<Shape>
  private shapeCorrector: ShapeCorrector
  private renderInterval?: number

  constructor(canvas: ICanvas) {
    this.canvas = canvas
    this.shapeCollection = []
    this.logger = Logger.get('Whiteboard')
    this.shapeCollector = new ShapeCollector(this.canvas)
    this.shapeCorrector = new ShapeCorrector()
  }

  @AsyncInit
  public async init() {
    await this.shapeCorrector.init()
    this.shapeCollector.atShapeCollected((shape) =>
      this.handleShapeCollected(shape)
    )
    this.shapeCollector.atDrawingStarted(() => this.handleDrawingStarted())
    this.shapeCollector.startCollectingShapes()
    this.logger.debug('Whiteboard initialized')
  }

  private handleDrawingStarted() {
    this.renderInterval = setInterval(() => this.render(), FRAME_INTERVAL)
  }

  @RequiresAsyncInit
  private async handleShapeCollected(shape: Polyline) {
    // const correctedShape = await this.shapeCorrector.correct(shape)
    this.shapeCollection.push(/*correctedShape*/ shape)
    clearInterval(this.renderInterval)
    this.render()
  }

  public render() {
    this.canvas.clear()
    const currentlyDrawnShape = this.shapeCollector.getCurrentlyDrawnShape()
    if (currentlyDrawnShape) {
      this.canvas.drawShape(currentlyDrawnShape)
    }
    for (const shape of this.shapeCollection) {
      this.canvas.drawShape(shape)
    }
  }
}
