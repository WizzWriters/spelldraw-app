import type { ILogger } from 'js-logger'
import Logger from 'js-logger'

export class HTMLCanvas {
  private logger: ILogger
  private canvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.logger = Logger.get('HTMLCanvas')
  }

  public resize(width: number, height: number): void {
    if (this.canvas.width != width || this.canvas.height != height) {
      this.canvas.width = width
      this.canvas.height = height
    }
    this.logger.debug('Canvas resized to x:' + width + ' y:' + height)
  }
}
