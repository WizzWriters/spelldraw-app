import Logger from 'js-logger'
import type { ILogger } from 'js-logger'
import * as tf from '@tensorflow/tfjs'

const shapes = ['other', 'ellipse', 'rectangle', 'triangle']

class TfModel {
  private logger: ILogger
  private layers: tf.LayersModel

  constructor(name) {
    return (async () => {
      this.logger = Logger.get(name)
      this.layers = await tf.loadLayersModel(
        `./models/ShapeWizard/${name}/model.json`
      )
      this.logger.debug('Model initialized!', this.layers)
      return this
    })()
  }
}

class Classifier extends TfModel {
  public classify(image: tf.Tensor4D) {
    const dist = this.layers.call(image)
    return shapes[tf.argMax(dist).dataSync()[0]]
  }
}

class Regressor extends TfModel {
  public vertices(image: tf.Tensor4D) {
    return Array.from(this.layers.call(image)[0].reshape([2, -1]).dataSync())
  }
}

class ShapeWizard {
  public classifier: TfModel
  public regressors: { [index: string]: TfModel }

  constructor() {
    return (async () => {
      this.classifier = await new Classifier('classifier')
      this.regressors = Object.fromEntries(
        await Promise.all(
          shapes
            .slice(1)
            .map(async (shape) => [shape, await new Regressor(shape)])
        )
      )
      return this
    })()
  }

  public call(image: tf.Tensor3D): Array<[number, number]> {
    const batch = tf.expandDims(image)
    const shape = this.classifier.classify(batch)
    return this.regressors[shape]?.vertices(batch) || []
  }
}

const model = await new ShapeWizard()
window.shapes = model
window.tf = tf
export default model
