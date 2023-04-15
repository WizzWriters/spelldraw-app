import Logger from 'js-logger'
import type { ILogger } from 'js-logger'
import * as tf from '@tensorflow/tfjs'
import { NotInitializedError } from './utils'

export default class TensorflowModel {
  private logger: ILogger
  private name: string
  protected layers: tf.LayersModel | undefined

  constructor(name: string) {
    this.logger = Logger.get(name)
    this.name = name
  }

  public call(x: tf.Tensor<tf.Rank>) {
    if (!this.layers) throw new NotInitializedError()
    return this.layers.call(x, {}) as [tf.Tensor<tf.Rank>]
  }

  public get meta() {
    if (!this.layers) throw new NotInitializedError()
    return this.layers.getConfig().name
  }

  public async init() {
    this.layers = await tf.loadLayersModel(`./models/${this.name}/model.json`)
    this.logger.debug('Model initialized!', this.layers)
    return this
  }
}
