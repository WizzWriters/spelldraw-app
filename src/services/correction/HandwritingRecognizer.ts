import {
  AsyncInit,
  AsyncInitialized,
  RequiresAsyncInit
} from '@/utils/decorators/AsyncInit'
import { HiddenCanvas } from './HiddenCanvas'
import ShapeNormalizer from './ShapeNormalizer'
import type ComplexShape from '@/common/definitions/ComplexShape'
import TextOracle from '../magic/TextOracle'
import * as tf from '@tensorflow/tfjs'
import TextCorpus from './TextCorpus'
import { TextBox } from '@/common/definitions/Shape'
import Text from '@/common/definitions/Text'
import Logger from 'js-logger'

/* To be moved */
const LINE_WIDTH = 2
const CANVAS_WIDTH = 128
const CANVAS_HEIGHT = 32
const CANVAS_PADDING_VERTICAL = 0
const CANVAS_PADDING_HORIZONTAL = 0
const KEEP_PROPORTIONS = true

@AsyncInitialized
export default class HandwritingRecognizer {
  private logger = Logger.get('TextPredictor')
  private hiddenCanvas = new HiddenCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)
  private shapeNormalizer = new ShapeNormalizer()
  private textOracle = new TextOracle()
  private textCorpus = new TextCorpus(100000)

  constructor() {
    if (import.meta.env.VITE_SHOW_TEXT_CANVAS === 'TRUE') {
      this.showCanvas()
    }
    this.hiddenCanvas.setLineWidth(LINE_WIDTH)
  }

  @AsyncInit
  public async init() {
    await this.textOracle.init()
  }

  @RequiresAsyncInit
  public async recognize(shape: ComplexShape): Promise<TextBox | null> {
    if (shape.fragments.length == 0) return null

    const textBoundingRect = shape.getBoundingRectangle()

    const normalizedShape = this.shapeNormalizer.normalize(
      shape,
      { width: CANVAS_WIDTH, height: CANVAS_HEIGHT },
      { v: CANVAS_PADDING_VERTICAL, h: CANVAS_PADDING_HORIZONTAL },
      KEEP_PROPORTIONS
    )
    this.hiddenCanvas.clear()
    for (const fragment of normalizedShape.shape.fragments) {
      this.hiddenCanvas.drawShape(fragment)
    }

    // Load grayscale tensor from html canvas
    const image = tf.browser.fromPixels(this.hiddenCanvas.htmlCanvas, 1)

    // Normalize to {0, 1}
    const imageNormalized = tf.round(image.div(tf.tensor(255.0))) as tf.Tensor3D
    const text = await this.textOracle.call(imageNormalized)

    // TODO: probably should reject corrections with large distance
    const recognizedWord = this.textCorpus.findMostSimilar(
      text.toLocaleLowerCase()
    )
    this.logger.debug(`Recognized word: ${recognizedWord}`)

    return new TextBox(
      textBoundingRect,
      new Text(recognizedWord, textBoundingRect.height)
    )
  }

  /* for debugging purposes only */
  private showCanvas() {
    // Hot-reloads tend to leave behind some canvases
    const leftoverCanvases =
      document.getElementsByClassName('debug-text-canvas')
    for (const leftover of leftoverCanvases) {
      leftover.remove()
    }

    this.hiddenCanvas.htmlCanvas.classList.add('debug-text-canvas')
    this.hiddenCanvas.htmlCanvas.style.position = 'fixed'
    this.hiddenCanvas.htmlCanvas.style.bottom = '0'
    this.hiddenCanvas.htmlCanvas.style.right = '0'
    document.body.appendChild(this.hiddenCanvas.htmlCanvas)
  }
}
