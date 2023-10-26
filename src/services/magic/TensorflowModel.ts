import WorkerPath from './TensorflowWorker?worker&url'
import type { Dictionary } from 'lodash'
import type { Tensor } from '@/common/definitions/Tensor'
import {
  TensorflowWorkerMessageType,
  type TensorflowWorkerCallResponse,
  type TensorflowWorkerMetaResponse,
  type TensorflowWorkerRequest,
  type TensorflowWorkerResponse
} from './TensorflowWorkerMessage'
import {
  AsyncInit,
  AsyncInitialized,
  RequiresAsyncInit
} from '@/utils/decorators/AsyncInit'

@AsyncInitialized
export default class TensorflowModel {
  protected worker: Worker

  constructor(name: string) {
    this.worker = new Worker(WorkerPath, { type: 'module', name })
  }

  @AsyncInit
  public async init() {
    await this.postRequest({ type: TensorflowWorkerMessageType.INIT_REQUEST })
  }

  private async postRequest(
    message: TensorflowWorkerRequest
  ): Promise<TensorflowWorkerResponse> {
    const { port1, port2 } = new MessageChannel()
    return new Promise((resolve, reject) => {
      port1.onmessage = (event) => resolve(event.data)
      this.worker.onerror = (error) => reject(error)
      this.worker.postMessage(message, [port2])
    })
  }

  @RequiresAsyncInit
  public async meta(): Promise<Dictionary<any>> {
    const response = (await this.postRequest({
      type: TensorflowWorkerMessageType.META_REQUEST
    })) as TensorflowWorkerMetaResponse
    return response.meta
  }

  @RequiresAsyncInit
  public async call(tensor: Tensor): Promise<Tensor> {
    const response = (await this.postRequest({
      type: TensorflowWorkerMessageType.CALL_REQUEST,
      tensor: tensor
    })) as TensorflowWorkerCallResponse
    return response.tensor
  }
}
