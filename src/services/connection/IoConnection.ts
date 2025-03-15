import Logger from 'js-logger'
import io from 'socket.io-client'

const env = import.meta.env
const backendUrl = `${env.VITE_BACKEND_DOMAIN}:${env.VITE_BACKEND_PORT}`

class IoConnection {
  private logger = Logger.get('Connection')
  private socket = io(backendUrl)

  constructor() {
    this.socket.on('connect', () => {
      this.logger.debug(`Connection to ${backendUrl} established!`)
    })
  }

  public emit(name: string, payload: unknown) {
    this.socket.emit(name, payload)
  }

  public emitVolatile(name: string, payload: unknown) {
    this.socket.volatile.emit(name, payload)
  }

  public request(name: string, payload: any) {
    return new Promise<any>((resolve) => {
      this.socket.emit(name, payload, (response: any) => {
        resolve(response)
      })
    })
  }

  public onEvent(name: string, callback: (payload: any) => void) {
    this.socket.on(name, callback)
  }
}

export default new IoConnection()
