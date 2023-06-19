import * as tf from '@tensorflow/tfjs'
import type { Dictionary } from 'lodash'

type Tensor = number | Tensor[]

export default class TfModel {
  protected worker: Worker

  constructor(name: string) {
    const path = '/src/services/magic/TensorflowWorker.ts'
    this.worker = new Worker(path, { type: 'module', name })
  }

  protected async post(message: null | Tensor) {
    return new Promise((resolve, reject) => {
      this.worker.onmessage = (event) => resolve(event.data)
      this.worker.onerror = (error) => reject(error)
      this.worker.postMessage(message)
    })
  }

  public async meta(): Promise<Dictionary<any>> {
    return (await this.post(null)) as Dictionary<any>
  }

  public async call(x: Tensor) {
    return (await this.post(x)) as Tensor
  }
}
