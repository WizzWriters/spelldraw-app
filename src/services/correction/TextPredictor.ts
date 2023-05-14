import { AsyncInit, AsyncInitialized } from '@/utils/decorators/AsyncInit'
import { HiddenCanvas } from './HiddenCanvas'

@AsyncInitialized
export default class TextPredictor {
  private hiddenCanvas = new HiddenCanvas(128, 32)

  constructor() {
    if (import.meta.env.VITE_SHOW_TEXT_CANVAS === 'TRUE') {
      this.showCanvas()
    }
    this.hiddenCanvas.setLineWidth(2)
  }

  @AsyncInit
  public async init() {}

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
