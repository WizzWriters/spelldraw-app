import type { PolyLineShape } from '../canvas/Geometry'
import ShapeWizard from '../magic/ShapeWizard'
import { HiddenCanvas } from './HiddenCanvas'
import ShapeNormalizer from './ShapeNormalizer'

const CANVAS_WIDTH = 70
const CANVAS_HEIGHT = 70
const CANVAS_PADDING = 0.15
const CANVAS_LINE_WIDTH = 2

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
  }

  public async init() {
    await this.shapeWizard.init()
    this.hiddenCanvas.resize(CANVAS_WIDTH, CANVAS_HEIGHT)
    this.hiddenCanvas.setLineWidth(CANVAS_LINE_WIDTH)
    this.hiddenCanvas.clear()
  }

  public correct(shape: PolyLineShape): PolyLineShape {
    const normalizedShape = this.shapeTranslator.normalize(
      shape,
      CANVAS_WIDTH,
      CANVAS_HEIGHT,
      CANVAS_PADDING
    )
    this.hiddenCanvas.clear()
    this.hiddenCanvas.drawShape(normalizedShape)

    /* Magic goes here, use this.hiddenCanvas.htmlCanvas */

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
