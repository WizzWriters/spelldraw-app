import pin from '@/helpers/Pinner'
import * as tf from '@tensorflow/tfjs'
import lodash from 'lodash'
import TensorflowModel from './TensorflowModel'
import { Point } from '../canvas/Geometry'
import {
  AsyncInit,
  AsyncInitialized,
  RequiresAsyncInit
} from '@/utils/decorators/AsyncInit'

export enum ShapeClassification {
  OTHER = 'other',
  ELLIPSE = 'ellipse',
  RECTANGLE = 'rectangle',
  TRIANGLE = 'triangle'
}

const shapes = lodash.values(ShapeClassification)
const path_name = 'ShapeWizard'

class Classifier extends TensorflowModel {
  public classify(image: tf.Tensor4D): ShapeClassification {
    const dist = this.call(image)
    return shapes[tf.argMax(dist[0], 1).dataSync()[0]]
  }
}

class Regressor extends TensorflowModel {
  public async vertices(image: tf.Tensor4D) {
    const vs = this.call(image)
    return (await vs[0].squeeze().mul(tf.scalar(70)).array()) as Array<
      [number, number]
    >
  }
}

@AsyncInitialized
export default class ShapeWizard {
  public static readonly INPUT_WIDTH = 70
  public static readonly INPUT_HEIGHT = 70
  public static readonly INPUT_PADDING = 0.15
  public static readonly INPUT_LINE_WIDTH = 2

  private classifier: Classifier
  private regressors: { [index: string]: Regressor }

  constructor() {
    this.classifier = new Classifier(`${path_name}/classifier`)

    this.regressors = {}
    shapes.slice(1).forEach((shape) => {
      this.regressors[shape] = new Regressor(`${path_name}/${shape}`)
    })

    pin('shapes', this)
  }

  @AsyncInit
  public async init() {
    const childInits = shapes.slice(1).map((shape) => {
      return this.regressors[shape].init()
    })
    childInits.push(this.classifier.init())
    await Promise.all(childInits)
  }

  @RequiresAsyncInit
  public async call(
    image: tf.Tensor3D
  ): Promise<[ShapeClassification, Array<Point>]> {
    const batch = tf.expandDims(image) as tf.Tensor4D
    const shape = this.classifier.classify(batch)

    if (!this.regressors[shape]) return [shape, []]

    const vertices = await this.regressors[shape].vertices(batch)
    const points = vertices.map((vertice) => new Point(vertice[0], vertice[1]))
    return [shape, points]
  }
}

pin('tf', tf) //TODO: move this somewhere else in the future
