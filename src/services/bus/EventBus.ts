import type { Rectangle, Segment } from '@/common/definitions/Geometry'

export enum EShapeEvent {
  CHECK_INTERSECTION = 'check-intersection',
  CHECK_SELECTION = 'check-selection'
}
export enum EMouseEvent {
  MOUSE_WHEEL_PRESSED = 'mouse-wheel-pressed',
  MOUSE_WHEEL_RELEASED = 'mouse-wheel-released'
}
type EEventType = EShapeEvent | EMouseEvent

export interface ICheckIntersectionPayload {
  pointerHitline: Segment
}

export interface ICheckSelectionPayload {
  selectBox: Rectangle
}

export interface IMouseWheelPayload {
  event: PointerEvent
}

type EventPayload =
  | ICheckIntersectionPayload
  | ICheckSelectionPayload
  | IMouseWheelPayload

export class EventCallback<PayloadT> {
  private wrappedCallback: (event: Event) => void

  constructor(callback: (payload: PayloadT) => void) {
    this.wrappedCallback = this.wrapCallback(callback)
  }

  public get callback() {
    return this.wrappedCallback
  }

  private wrapCallback(callback: (payload: PayloadT) => void) {
    return (event: Event) => {
      const customEvent = event as CustomEvent
      callback(customEvent.detail)
    }
  }
}

type EventCallbacks =
  | EventCallback<ICheckIntersectionPayload>
  | EventCallback<ICheckSelectionPayload>
  | EventCallback<IMouseWheelPayload>

class EventBus {
  public emit(
    event: EShapeEvent.CHECK_INTERSECTION,
    payload: ICheckIntersectionPayload
  ): void
  public emit(
    event: EShapeEvent.CHECK_SELECTION,
    payload: ICheckSelectionPayload
  ): void
  public emit(
    event: EMouseEvent.MOUSE_WHEEL_PRESSED | EMouseEvent.MOUSE_WHEEL_RELEASED,
    payload: IMouseWheelPayload
  ): void
  public emit(event: EEventType, payload: EventPayload) {
    this.dispatchEvent(event, payload)
  }

  public subscribe(
    event: EShapeEvent.CHECK_INTERSECTION,
    callback: EventCallback<ICheckIntersectionPayload>
  ): void
  public subscribe(
    event: EShapeEvent.CHECK_SELECTION,
    callback: EventCallback<ICheckSelectionPayload>
  ): void
  public subscribe(
    event: EMouseEvent.MOUSE_WHEEL_PRESSED | EMouseEvent.MOUSE_WHEEL_RELEASED,
    callback: EventCallback<IMouseWheelPayload>
  ): void
  public subscribe(event: EEventType, callback: EventCallbacks) {
    this.registerCallback(event, callback)
  }

  public unsubscribe(event: EEventType, callback: EventCallbacks) {
    this.unregisterCallback(event, callback)
  }

  private dispatchEvent(eventName: string, payload: unknown) {
    const intersectionEvent = new CustomEvent(eventName, { detail: payload })
    document.dispatchEvent(intersectionEvent)
  }

  private registerCallback(eventName: string, eventCallback: EventCallbacks) {
    document.addEventListener(eventName, eventCallback.callback)
  }

  private unregisterCallback(eventName: string, eventCallback: EventCallbacks) {
    document.removeEventListener(eventName, eventCallback.callback)
  }
}

export default new EventBus()
