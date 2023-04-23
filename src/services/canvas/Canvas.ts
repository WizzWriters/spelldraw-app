import type { Point, Shape } from './Geometry'
import type { IPointerPosition } from './Pointer'

export enum ECanvasPointerEvent {
  POINTER_DOWN = 'pointerdown',
  POINTER_UP = 'pointerup',
  POINTER_MOVED = 'pointermove',
  POINTER_LEFT = 'pointerleave'
}

export interface ICanvas {
  resize(width: number, height: number): void
  getPointerPosition(absolutePointerPosition?: IPointerPosition): Point
  atPointerEvent(
    eventType: ECanvasPointerEvent,
    callback: (event: PointerEvent) => void
  ): void
  drawShape(shape: Shape): void
  clear(): void
}
