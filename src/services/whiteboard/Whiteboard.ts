import Logger from 'js-logger'
import type { ILogger } from 'js-logger'
import type { ICanvas } from '../canvas/Canvas'
import { ShapeCollector } from './ShapeCollector'
import type { PolyLineShape } from '../canvas/Geometry'
import ShapeCorrector from '../correction/ShapeCorrector'

const FRAME_INTERVAL = (1 / 50) * 1000

export default class Whiteboard {
  private logger: ILogger
  private canvas: ICanvas
  private shapeCollector: ShapeCollector
  private shapeCollection: Array<PolyLineShape>
  private shapeCorrector: ShapeCorrector
  private renderInterval?: number

  constructor(canvas: ICanvas) {
    this.canvas = canvas
    this.shapeCollection = []
    this.logger = Logger.get('Whiteboard')
    this.shapeCollector = new ShapeCollector(this.canvas)
    this.shapeCorrector = new ShapeCorrector()
  }

  public init() {
    this.shapeCollector.atShapeCollected((shape) =>
      this.handleShapeCollected(shape)
    )
    this.shapeCollector.atDrawingStarted(() => this.handleDrawingStarted())
    this.shapeCollector.startCollectingShapes()
  }

  private handleDrawingStarted() {
    this.renderInterval = setInterval(() => this.render(), FRAME_INTERVAL)
  }

  private async handleShapeCollected(shape: PolyLineShape) {
    await this.shapeCorrector.correct(shape)
    this.shapeCollection.push(shape)
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
