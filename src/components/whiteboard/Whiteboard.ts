import Logger from 'js-logger'
import type { ILogger } from 'js-logger'
import type { ICanvas } from './canvas/Canvas'
import { ShapeCollector } from './ShapeCollector'
import type { Shape } from './canvas/Geometry'

const FRAME_INTERVAL = (1 / 50) * 1000

export default class Whiteboard {
  private logger: ILogger
  private canvas: ICanvas
  private shapeCollector: ShapeCollector
  private shapeCollection: Array<Shape>
  private renderInterval?: number

  constructor(canvas: ICanvas) {
    this.canvas = canvas
    this.shapeCollection = []
    this.logger = Logger.get('Whiteboard')
    this.shapeCollector = new ShapeCollector(this.canvas)
    this.shapeCollector.atShapeCollected((shape) =>
      this.handleShapeCollected(shape)
    )
    this.shapeCollector.atDrawingStarted(() => this.handleDrawingStarted())
    this.shapeCollector.startCollectingShapes()
  }

  private handleDrawingStarted() {
    this.renderInterval = setInterval(() => this.render(), FRAME_INTERVAL)
  }

  private handleShapeCollected(shape: Shape) {
    this.shapeCollection.push(shape)
    clearInterval(this.renderInterval)
    this.render()
  }

  public render() {
    this.canvas.clear()
    let currentlyDrawnShape = this.shapeCollector.getCurrentlyDrawnShape()
    if (currentlyDrawnShape) {
      this.canvas.drawShape(currentlyDrawnShape)
    }
    for (let shape of this.shapeCollection) {
      this.canvas.drawShape(shape)
    }
  }
}
