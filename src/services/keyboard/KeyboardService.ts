import Logger, { type ILogger } from 'js-logger'
import KeyMap, { type KeyCallback } from './KeyMap'

type KeyboardServiceMap = Map<string, KeyboardService>

class KeyboardService {
  private logger: ILogger
  private keyTree: KeyMap = new KeyMap()

  constructor(keyspace: string) {
    this.logger = Logger.get(`KeyboardService[${keyspace}]`)
  }

  public registerCallback(keySequence: string[], callback: KeyCallback) {
    this.keyTree.set(keySequence, callback)
  }

  public handleClick(keySequence: string[]) {
    const callback = this.keyTree.get(keySequence)
    if (callback) callback()
  }
}

class GlobalKeyboardService {
  private logger = Logger.get('KeyboardService')
  private keyspaces: KeyboardServiceMap = new Map<string, KeyboardService>()
  private selectedKeyspace: string | null = null

  constructor() {
    const clickHandler = (event: KeyboardEvent) => this.handleClick(event)
    window.removeEventListener('keydown', clickHandler)
    window.addEventListener('keydown', clickHandler)
  }

  public get(keyspace: string) {
    if (this.keyspaces.has(keyspace)) return this.keyspaces.get(keyspace)!

    const newKeyboardService = new KeyboardService(keyspace)
    this.keyspaces.set(keyspace, newKeyboardService)
    this.logger.debug(`New keyspace added: ${keyspace}`)

    return newKeyboardService
  }

  public activateKeyspace(keyspace: string | null) {
    const previousKeyspace = this.selectedKeyspace
    this.selectedKeyspace = keyspace
    this.logger.debug(`Activated keyspace ${keyspace}`)
    return previousKeyspace
  }

  public handleClick(event: KeyboardEvent) {
    const keySequence: Array<string> = []
    /* For now support only combinations with ctrl */
    if (event.ctrlKey && event.key != 'Control') keySequence.push('Control')
    keySequence.push(event.key)

    if (this.selectedKeyspace) {
      const service = this.get(this.selectedKeyspace)
      service.handleClick(keySequence)
    }
  }
}

export default new GlobalKeyboardService()
