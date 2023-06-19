import type { Dictionary } from 'lodash'

export type Tensor = number[] | Tensor[]

export default class TensorflowModel {
  protected worker: Worker

  constructor(name: string) {
    const path = '/src/services/magic/TensorflowWorker.ts'
    this.worker = new Worker(path, { type: 'module', name })
  }

  protected async post(message: null | Tensor) {
    const { port1, port2 } = new MessageChannel()
    return new Promise((resolve, reject) => {
      port1.onmessage = (event) => resolve(event.data)
      this.worker.onerror = (error) => reject(error)
      this.worker.postMessage(message, [port2])
    })
  }

  public async meta(): Promise<Dictionary<any>> {
    return (await this.post(null)) as Dictionary<any>
  }

  public async call(x: Tensor): Promise<Tensor> {
    return ((await this.post(x)) as Tensor[])[0]
  }
}
