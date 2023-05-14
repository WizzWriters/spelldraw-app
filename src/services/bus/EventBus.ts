import type { Rectangle, Segment } from '@/common/definitions/Geometry'

export enum EShapeEvent {
  CHECK_INTERSECTION = 'check-intersection',
  CHECK_SELECTION = 'check-selection'
}

export interface ICheckIntersectionPayload {
  pointerHitline: Segment
}

export interface ICheckSelectionPayload {
  selectBox: Rectangle
}

type ShapeEventPayload = ICheckIntersectionPayload | ICheckSelectionPayload

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

type ShapeEventCallback =
  | EventCallback<ICheckIntersectionPayload>
  | EventCallback<ICheckSelectionPayload>

class EventBus {
  public emit(
    event: EShapeEvent.CHECK_INTERSECTION,
    payload: ICheckIntersectionPayload
  ): void
  public emit(
    event: EShapeEvent.CHECK_SELECTION,
    payload: ICheckSelectionPayload
  ): void
  public emit(event: EShapeEvent, payload: ShapeEventPayload) {
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
  public subscribe(event: EShapeEvent, callback: ShapeEventCallback) {
    this.registerCallback(event, callback)
  }

  public unsubscribe(event: EShapeEvent, callback: ShapeEventCallback) {
    this.unregisterCallback(event, callback)
  }

  private dispatchEvent(eventName: string, payload: any) {
    const intersectionEvent = new CustomEvent(eventName, { detail: payload })
    document.dispatchEvent(intersectionEvent)
  }

  private registerCallback(
    eventName: string,
    eventCallback: EventCallback<any>
  ) {
    document.addEventListener(eventName, eventCallback.callback)
  }

  private unregisterCallback(
    eventName: string,
    eventCallback: EventCallback<any>
  ) {
    document.removeEventListener(eventName, eventCallback.callback)
  }
}

export default new EventBus()
