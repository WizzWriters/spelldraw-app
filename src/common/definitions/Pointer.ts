import type { Point } from './Geometry'

export enum EPointerEvent {
  POINTER_DOWN = 'pointerdown',
  POINTER_UP = 'pointerup',
  POINTER_MOVED = 'pointermove',
  POINTER_LEFT = 'pointerleave'
}

export class ExternalPointerIcon {
  constructor(public url: string, public hotspot: Point) {}
}

export class BuiltinPointerIcon {
  constructor(public name: 'crosshair') {}
}

export interface IPointerPosition {
  yCoordinate: number
  xCoordinate: number
}
