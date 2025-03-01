import type { Point } from './Geometry'

export enum EPointerEvent {
  POINTER_DOWN = 'pointerdown',
  POINTER_UP = 'pointerup',
  POINTER_MOVED = 'pointermove',
  POINTER_LEFT = 'pointerleave'
}

type BuitInIcon = 'crosshair' | 'grab' | 'default'

export class ExternalPointerIcon {
  constructor(
    public url: string,
    public hotspot: Point
  ) {}
}

export class BuiltinPointerIcon {
  constructor(public name: BuitInIcon) {}
}

export interface IPointerPosition {
  yCoordinate: number
  xCoordinate: number
}
