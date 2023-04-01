import type { Canvas } from './Canvas'

export default class Whiteboard {
  private canvas: Canvas

  constructor(canvas: Canvas) {
    this.canvas = canvas
  }
}
