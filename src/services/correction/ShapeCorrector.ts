import {
  AsyncInit,
  AsyncInitialized,
  RequiresAsyncInit
} from '@/utils/decorators/AsyncInit'
import type { PolyLineShape } from '../canvas/Geometry'
import ShapeWizard from '../magic/ShapeWizard'
import { HiddenCanvas } from './HiddenCanvas'
import ShapeNormalizer from './ShapeNormalizer'
import * as tf from '@tensorflow/tfjs'

const CANVAS_WIDTH = 70
const CANVAS_HEIGHT = 70
const CANVAS_PADDING = 0.15
const CANVAS_LINE_WIDTH = 2

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
    this.hiddenCanvas.resize(CANVAS_WIDTH, CANVAS_HEIGHT)
    this.hiddenCanvas.setLineWidth(CANVAS_LINE_WIDTH)
    this.hiddenCanvas.clear()
  }

  @AsyncInit
  public async init() {
    await this.shapeWizard.init()
  }

  @RequiresAsyncInit
  public async correct(shape: PolyLineShape): Promise<PolyLineShape> {
    const normalizedShape = this.shapeTranslator.normalize(
      shape,
      CANVAS_WIDTH,
      CANVAS_HEIGHT,
      CANVAS_PADDING
    )
    this.hiddenCanvas.clear()
    this.hiddenCanvas.drawShape(normalizedShape)

    /* Magic goes here, use this.hiddenCanvas.htmlCanvas */

    // Load grayscale tensor from html canvas
    const image = tf.browser.fromPixels(this.hiddenCanvas.htmlCanvas, 1)

    // Normalize to [0, 1]
    const imageNormalized = image.div(tf.tensor(255.0)) as tf.Tensor3D

    // Shape wizard usage example
    console.log(await this.shapeWizard.call(imageNormalized))

    return shape
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
