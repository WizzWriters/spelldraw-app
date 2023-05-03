import type { Point } from './Geometry'

export enum EPointerEvent {
  POINTER_DOWN = 'pointerdown',
  POINTER_UP = 'pointerup',
  POINTER_MOVED = 'pointermove',
  POINTER_LEFT = 'pointerleave'
}

export interface IPointerIcon {
  url: string
  hotspot: Point
}

export interface IPointerPosition {
  yCoordinate: number
  xCoordinate: number
}
