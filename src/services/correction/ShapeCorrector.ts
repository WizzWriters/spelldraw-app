import {
  AsyncInit,
  AsyncInitialized,
  RequiresAsyncInit
} from '@/utils/decorators/AsyncInit'
import {
  Polyline,
  Polygon,
  Shape,
  RoundShape,
  PointListBasedShape
} from '@/common/definitions/Shape'
import ShapeWizard, { ShapeClassification } from '../magic/ShapeWizard'
import { HiddenCanvas } from './HiddenCanvas'
import ShapeNormalizer from './ShapeNormalizer'
import * as tf from '@tensorflow/tfjs'
import ComplexShape from '@/common/definitions/ComplexShape'

@AsyncInitialized
export default class ShapeCorrector {
  private hiddenCanvas = new HiddenCanvas(
    ShapeWizard.INPUT_WIDTH,
    ShapeWizard.INPUT_HEIGHT
  )
  private shapeWizard = new ShapeWizard()
  private shapeTranslator = new ShapeNormalizer()

  constructor() {
    if (import.meta.env.VITE_SHOW_SHAPE_CANVAS === 'TRUE') {
      this.showCanvas()
    }
    this.hiddenCanvas.setLineWidth(ShapeWizard.INPUT_LINE_WIDTH)
  }

  @AsyncInit
  public async init() {
    await this.shapeWizard.init()
  }

  @RequiresAsyncInit
  public async correct(shape: Shape): Promise<Shape | null> {
    if (!(shape instanceof Polyline)) return shape

    const normalizedShape = this.shapeTranslator.normalize(
      new ComplexShape([shape]),
      { width: ShapeWizard.INPUT_WIDTH, height: ShapeWizard.INPUT_HEIGHT },
      { v: ShapeWizard.INPUT_PADDING, h: ShapeWizard.INPUT_PADDING },
      ShapeWizard.INPUT_KEEP_PROPORTIONS
    )

    this.hiddenCanvas.clear()
    this.hiddenCanvas.drawShape(normalizedShape.shape.fragments[0])

    // Load grayscale tensor from html canvas
    const image = tf.browser.fromPixels(this.hiddenCanvas.htmlCanvas, 1)

    // Normalize to [0, 1]
    const imageNormalized = image.div(tf.tensor(255.0)) as tf.Tensor3D

    const [shapeLabel, newPoints] = await this.shapeWizard.call(imageNormalized)

    if (shapeLabel == ShapeClassification.OTHER) return null

    const newShape = new Polyline(newPoints)
    normalizedShape.shape.fragments = [newShape]
    const denormalizedShape = this.shapeTranslator.denormalize(normalizedShape)
    return this.recognitionToShape(
      shapeLabel,
      denormalizedShape.fragments[0] as Polyline
    )
  }

  private recognitionToShape(
    shapeLabel: ShapeClassification,
    shape: PointListBasedShape
  ): Shape {
    switch (shapeLabel) {
      case ShapeClassification.RECTANGLE:
      case ShapeClassification.TRIANGLE:
        return new Polygon(shape.pointList)
      case ShapeClassification.ELLIPSE:
        return new RoundShape(shape.pointList)
      default:
        return new Polygon(shape.pointList)
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
