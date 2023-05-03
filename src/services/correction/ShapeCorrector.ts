import {
  AsyncInit,
  AsyncInitialized,
  RequiresAsyncInit
} from '@/utils/decorators/AsyncInit'
import {
  Polyline,
  Polygon,
  Shape,
  RoundShape
} from '@/common/definitions/Shape'
import ShapeWizard, { ShapeClassification } from '../magic/ShapeWizard'
import { HiddenCanvas } from './HiddenCanvas'
import ShapeNormalizer from './ShapeNormalizer'
import * as tf from '@tensorflow/tfjs'
import type { Point } from '@/common/definitions/Geometry'

@AsyncInitialized
export default class ShapeCorrector {
  private hiddenCanvas: HiddenCanvas
  private shapeWizard: ShapeWizard
  private shapeTranslator: ShapeNormalizer

  constructor() {
    this.hiddenCanvas = new HiddenCanvas()
    this.shapeWizard = new ShapeWizard()
    this.shapeTranslator = new ShapeNormalizer()

    if (import.meta.env.VITE_SHOW_SHAPE_CANVAS === 'TRUE') {
      this.showCanvas()
    }
    this.hiddenCanvas.resize(ShapeWizard.INPUT_WIDTH, ShapeWizard.INPUT_HEIGHT)
    this.hiddenCanvas.setLineWidth(ShapeWizard.INPUT_LINE_WIDTH)
    this.hiddenCanvas.clear()
  }

  @AsyncInit
  public async init() {
    await this.shapeWizard.init()
  }

  @RequiresAsyncInit
  public async correct(shape: Polyline): Promise<Shape | null> {
    const normalizedShape = this.shapeTranslator.normalize(
      shape,
      ShapeWizard.INPUT_WIDTH,
      ShapeWizard.INPUT_HEIGHT,
      ShapeWizard.INPUT_PADDING
    )
    this.hiddenCanvas.clear()
    this.hiddenCanvas.drawShape(normalizedShape.shape)

    // Load grayscale tensor from html canvas
    const image = tf.browser.fromPixels(this.hiddenCanvas.htmlCanvas, 1)

    // Normalize to [0, 1]
    const imageNormalized = image.div(tf.tensor(255.0)) as tf.Tensor3D

    const [shapeLabel, newPoints] = await this.shapeWizard.call(imageNormalized)

    if (shapeLabel == ShapeClassification.OTHER) return null

    const newShape = new Polyline(newPoints)
    normalizedShape.shape = newShape
    const denormalizedShape = this.shapeTranslator.denormalize(normalizedShape)
    return this.recognitionToShape(shapeLabel, denormalizedShape.pointList)
  }

  private recognitionToShape(
    shapeLabel: ShapeClassification,
    points: Point[]
  ): Shape {
    switch (shapeLabel) {
      case ShapeClassification.RECTANGLE:
      case ShapeClassification.TRIANGLE:
        return new Polygon(points)
      case ShapeClassification.ELLIPSE: {
        return new RoundShape(points)
      }
      default:
        return new Polygon(points)
    }
  }

  /* for debugging purposes only */
  private showCanvas() {
    // Hot-reloads tend to leave behind some canvases
    const leftoverCanvases =
      document.getElementsByClassName('debug-shape-canvas')
    for (const leftover of leftoverCanvases) {
      leftover.remove()
    }

    this.hiddenCanvas.htmlCanvas.classList.add('debug-shape-canvas')
    this.hiddenCanvas.htmlCanvas.style.position = 'fixed'
    this.hiddenCanvas.htmlCanvas.style.bottom = '0'
    document.body.appendChild(this.hiddenCanvas.htmlCanvas)
  }
}
