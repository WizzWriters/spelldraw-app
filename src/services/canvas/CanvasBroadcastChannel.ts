import Logger from 'js-logger'

export enum ECanvasBroadcastEventType {
  RELOAD = 'reload'
}

export interface IReloadMessagePayload {
  localBoardId: number
}

type CanvasBroadcastMessagePayload = IReloadMessagePayload

export interface ICanvasBroadcastMessage {
  type: ECanvasBroadcastEventType
  payload: CanvasBroadcastMessagePayload
}

export class MessageCallback<T> {
  constructor(public callback: (payload: T) => void) {}
}

type MessageCallbacks = MessageCallback<IReloadMessagePayload>

interface ICallbackMap {
  [Key: string]: MessageCallbacks
}

class CanvasBroadcastChannel {
  private logger = Logger.get('CanvasBroadcastChannel')
  private broadcastChannel = new BroadcastChannel('spelldraw_canvas')
  private callbacks: ICallbackMap = {}

  constructor() {
    this.broadcastChannel.onmessage = (message) => this.handleMessage(message)
  }

  public emit(
    type: ECanvasBroadcastEventType.RELOAD,
    payload: IReloadMessagePayload
  ): void
  public emit(
    type: ECanvasBroadcastEventType,
    payload: CanvasBroadcastMessagePayload
  ): void {
    const message: ICanvasBroadcastMessage = {
      type,
      payload
    }
    this.broadcastChannel.postMessage(message)
  }

  public on(
    type: ECanvasBroadcastEventType.RELOAD,
    callback: MessageCallback<IReloadMessagePayload>
  ): void
  public on(type: ECanvasBroadcastEventType, callback: MessageCallbacks) {
    if (this.callbacks[type]) {
      this.logger.warn(`Callback already registered for ${type}`)
      return
    }
    this.callbacks[type] = callback
  }

  private handleMessage(event: MessageEvent<any>) {
    const message: ICanvasBroadcastMessage = event.data
    if (!message.type) return

    const callback = this.callbacks[message.type]
    if (!callback) return

    callback.callback(message.payload)
  }
}

export default new CanvasBroadcastChannel()
