import Logger from 'js-logger'
import type { ILogger } from 'js-logger'
import pin from '@/helpers/Pinner'
import * as tf from '@tensorflow/tfjs'
import _ from 'lodash'

const shapes = ['other', 'ellipse', 'rectangle', 'triangle']

class NotInitializedError extends Error {
  constructor() {
    super('Model not initialized')
  }
}

class TfModel {
  private logger: ILogger
  private name: string
  protected layers: tf.LayersModel | undefined

  constructor(name: string) {
    this.logger = Logger.get(name)
    this.name = name
  }

  public async init() {
    this.layers = await tf.loadLayersModel(
      `./models/ShapeWizard/${this.name}/model.json`
    )
    this.logger.debug('Model initialized!', this.layers)
    return this
  }
}

class Classifier extends TfModel {
  public classify(image: tf.Tensor4D) {
    if (!this.layers) throw new NotInitializedError()
    const dist = this.layers.call(image, {}) as tf.Tensor2D
    return shapes[tf.argMax(dist).dataSync()[0]]
  }
}

class Regressor extends TfModel {
  public async vertices(image: tf.Tensor4D) {
    if (!this.layers) throw new NotInitializedError()
    const vs = this.layers.call(image, {}) as tf.Tensor2D[]
    return vs[0].reshape([-1, 2]).array() as unknown as Array<[number, number]>
  }
}

class ShapeWizard {
  public classifier: Classifier | undefined
  public regressors: { [index: string]: Regressor } | undefined

  public async init(): Promise<ShapeWizard> {
    pin('shapes', this)
    this.classifier = await new Classifier('classifier').init()
    this.regressors = _.fromPairs(
      await Promise.all(
        shapes
          .slice(1)
          .map(async (shape) => [shape, await new Regressor(shape).init()])
      )
    )
    return this
  }

  public async call(image: tf.Tensor3D): Promise<Array<[number, number]>> {
    if (!this.classifier || !this.regressors) throw new NotInitializedError()
    const batch = tf.expandDims(image) as tf.Tensor4D
    const shape = this.classifier.classify(batch)
    return (await this.regressors[shape]?.vertices(batch)) || []
  }
}

pin('tf', tf) //TODO: move this somewhere else in the future
export default await new ShapeWizard().init()
