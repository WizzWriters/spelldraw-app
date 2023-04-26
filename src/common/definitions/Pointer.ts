export enum EPointerEvent {
  POINTER_DOWN = 'pointerdown',
  POINTER_UP = 'pointerup',
  POINTER_MOVED = 'pointermove',
  POINTER_LEFT = 'pointerleave'
}

export interface IPointerPosition {
  yCoordinate: number
  xCoordinate: number
}
