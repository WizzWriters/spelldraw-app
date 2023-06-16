import Logger from 'js-logger'
import type { ILogger } from 'js-logger'
import * as tf from '@tensorflow/tfjs'
import {
  AsyncInit,
  RequiresAsyncInit,
  AsyncInitialized
} from '@/utils/decorators/AsyncInit'
import type { Dictionary } from 'lodash'

@AsyncInitialized
export default class TensorflowModel {
  private name: string
  protected logger: ILogger
  protected layers!: tf.LayersModel

  constructor(name: string) {
    this.logger = Logger.get(name)
    this.name = name
  }

  @AsyncInit
  public async init() {
    const currenUrl = new URL(import.meta.url)
    const modelUrl =
      currenUrl.origin +
      import.meta.env.BASE_URL +
      `models/${this.name}/model.json`
    this.layers = await tf.loadLayersModel(modelUrl)
    this.logger.debug('Model initialized!', this.layers)
  }

  @RequiresAsyncInit
  public meta(): Dictionary<any> {
    return this.layers.getConfig().name as Dictionary<any>
  }

  @RequiresAsyncInit
  public call(x: tf.Tensor<tf.Rank>) {
    return this.layers.call(x, {}) as [tf.Tensor<tf.Rank>]
  }
}
