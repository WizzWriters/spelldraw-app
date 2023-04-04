import Logger from 'js-logger'
import type { ILogger } from 'js-logger'
import type { ICanvas } from './canvas/Canvas'
import { ShapeCollector } from './ShapeCollector'
import type { Shape } from './canvas/Geometry'

export default class Whiteboard {
  private logger: ILogger
  private canvas: ICanvas
  private shapeCollector: ShapeCollector

  constructor(canvas: ICanvas) {
    this.canvas = canvas
    this.logger = Logger.get('Whiteboard')
    this.shapeCollector = new ShapeCollector(this.canvas)
    this.shapeCollector.atShapeCollected((shape) =>
      this.handleShapeCollected(shape)
    )
    this.shapeCollector.startCollectingShapes()
  }

  private handleShapeCollected(shape: Shape) {
    this.canvas.drawShape(shape)
  }
}
