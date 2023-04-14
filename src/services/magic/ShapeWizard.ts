import pin from '@/helpers/Pinner'
import * as tf from '@tensorflow/tfjs'
import _ from 'lodash'
import { NotInitializedError } from './utils'
import TensorflowModel from './TensorflowModel'

const shapes = ['other', 'ellipse', 'rectangle', 'triangle']
const path_name = 'ShapeWizard'

class Classifier extends TensorflowModel {
  public classify(image: tf.Tensor4D) {
    if (!this.layers) throw new NotInitializedError()
    const dist = this.layers.call(image, {}) as tf.Tensor2D
    return shapes[tf.argMax(dist).dataSync()[0]]
  }
}

class Regressor extends TensorflowModel {
  public async vertices(image: tf.Tensor4D) {
    if (!this.layers) throw new NotInitializedError()
    const vs = this.layers.call(image, {}) as tf.Tensor2D[]
    return vs[0].reshape([-1, 2]).array() as unknown as Array<[number, number]>
  }
}

export default class ShapeWizard {
  public classifier: Classifier | undefined
  public regressors: { [index: string]: Regressor } | undefined

  public async init() {
    pin('shapes', this)
    this.classifier = await new Classifier(`${path_name}/classifier`).init()
    this.regressors = _.fromPairs(
      await Promise.all(
        shapes
          .slice(1)
          .map(async (shape) => [
            shape,
            await new Regressor(`${path_name}/${shape}`).init()
          ])
      )
    )
  }

  public async call(image: tf.Tensor3D): Promise<Array<[number, number]>> {
    if (!this.classifier || !this.regressors) throw new NotInitializedError()
    const batch = tf.expandDims(image) as tf.Tensor4D
    const shape = this.classifier.classify(batch)
    return (await this.regressors[shape]?.vertices(batch)) || []
  }
}

pin('tf', tf) //TODO: move this somewhere else in the future
