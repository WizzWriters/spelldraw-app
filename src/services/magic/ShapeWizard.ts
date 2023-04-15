import pin from '@/helpers/Pinner'
import * as tf from '@tensorflow/tfjs'
import { NotInitializedError } from './utils'
import TensorflowModel from './TensorflowModel'
import { Point } from '../canvas/Geometry'

export enum ShapeClassification {
  OTHER = 'other',
  ELLIPSE = 'ellipse',
  RECTANGLE = 'rectangle',
  TRIANGLE = 'triangle'
}

const shapes = [
  ShapeClassification.OTHER,
  ShapeClassification.ELLIPSE,
  ShapeClassification.RECTANGLE,
  ShapeClassification.TRIANGLE
]
const path_name = 'ShapeWizard'

class Classifier extends TensorflowModel {
  public classify(image: tf.Tensor4D): ShapeClassification {
    if (!this.layers) throw new NotInitializedError()
    const dist = this.call(image)
    return shapes[tf.argMax(dist[0], 1).dataSync()[0]]
  }
}

class Regressor extends TensorflowModel {
  public async vertices(image: tf.Tensor4D): Promise<Array<[number, number]>> {
    if (!this.layers) throw new NotInitializedError()
    const vs = this.call(image)
    return (await vs[0].reshape([-1, 2]).array()) as Array<[number, number]>
  }
}

export default class ShapeWizard {
  private classifier: Classifier
  private regressors: { [index: string]: Regressor }

  constructor() {
    pin('shapes', this)
    this.classifier = new Classifier(`${path_name}/classifier`)

    this.regressors = {}
    shapes.slice(1).forEach((shape) => {
      this.regressors[shape] = new Regressor(`${path_name}/${shape}`)
    })
  }

  public async call(
    image: tf.Tensor3D
  ): Promise<[ShapeClassification, Array<Point>]> {
    const batch = tf.expandDims(image) as tf.Tensor4D
    await this.classifier.ready
    const shape = this.classifier.classify(batch)

    if (!this.regressors[shape]) return [shape, []]

    await this.regressors[shape].ready
    const vertices = await this.regressors[shape].vertices(batch)
    const points = vertices.map((vertice) => new Point(vertice[0], vertice[1]))
    return [shape, points]
  }
}

pin('tf', tf) //TODO: move this somewhere else in the future
