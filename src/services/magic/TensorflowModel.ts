import Logger from 'js-logger'
import type { ILogger } from 'js-logger'
import * as tf from '@tensorflow/tfjs'
import { NotInitializedError } from './utils'

export default class TensorflowModel {
  public ready: Promise<void>
  private logger: ILogger
  private name: string
  protected layers: tf.LayersModel | undefined

  constructor(name: string) {
    this.logger = Logger.get(name)
    this.name = name

    this.ready = new Promise((resolve, reject) => {
      tf.loadLayersModel(`./models/${this.name}/model.json`)
        .then((layers) => {
          this.layers = layers
          this.logger.debug('Model initialized!', this.layers)
          resolve()
        })
        .catch(reject)
    })
  }

  public call(x: tf.Tensor<tf.Rank>) {
    if (!this.layers) throw new NotInitializedError()
    return this.layers.call(x, {}) as [tf.Tensor<tf.Rank>]
  }

  public get meta() {
    if (!this.layers) throw new NotInitializedError()
    return this.layers.getConfig().name
  }
}
