import pin from '@/helpers/Pinner'
import * as tf from '@tensorflow/tfjs'
import lodash from 'lodash'
import TensorflowModel from './TensorflowModel'
import { Point } from '@/common/definitions/Geometry'
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

type point = [number, number]
const shapes = lodash.values(ShapeClassification)
const path_name = 'ShapeWizard'

class Classifier extends TensorflowModel {
  public classify(image: tf.Tensor4D): [ShapeClassification, number] {
    const dist = this.call(image)[0]
    const shape = shapes[tf.argMax(dist, 1).dataSync()[0]]
    const certainty = tf.max(dist).dataSync()[0]
    this.logger.debug(
      `Classified as ${shape} with ${(100 * certainty).toFixed(2)} certainty`
    )
    return [shape, certainty]
  }
}

class Regressor extends TensorflowModel {
  private sortByKeys(arr: point[], keys: number[]) {
    const pairs: Array<[point, number]> = arr.map((a, i) => [a, keys[i]])
    pairs.sort((a, b) => a[1] - b[1])
    return pairs.map((pair) => pair[0])
  }

  private async sortClockwise(vs: tf.Tensor2D) {
    const vcount = tf.scalar(vs.shape[0])
    const centroid = tf.sum(vs, 0).div(vcount)
    const [X, Y] = vs.sub(centroid).split(2, 1)
    const angles = await tf.atan2(X, Y).flatten().array()
    const vsarr = (await vs.array()) as point[]
    return this.sortByKeys(vsarr, angles)
  }

  public async vertices(image: tf.Tensor4D) {
    const vs = this.call(image)[0].reshape([-1, 2]) as tf.Tensor2D
    return await this.sortClockwise(vs)
  }
}

@AsyncInitialized
export default class ShapeWizard {
  public static readonly INPUT_WIDTH = 70
  public static readonly INPUT_HEIGHT = 70
  public static readonly INPUT_PADDING = 0.15
  public static readonly INPUT_LINE_WIDTH = 2

  public uncertaintyTolerance: number
  private classifier: Classifier
  private regressors: { [index: string]: Regressor }

  constructor(uncertaintyTolerance = 0) {
    this.uncertaintyTolerance = uncertaintyTolerance
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
    const [shape, certainty] = this.classifier.classify(batch)

    if (!this.regressors[shape]) return [shape, []]
    if (certainty < this.uncertaintyTolerance)
      return [ShapeClassification.OTHER, []]

    const vertices = await this.regressors[shape].vertices(batch)
    const points = vertices.map(
      (vertice) =>
        new Point(
          vertice[0] * ShapeWizard.INPUT_WIDTH,
          vertice[1] * ShapeWizard.INPUT_HEIGHT
        )
    )
    return [shape, points]
  }
}

pin('tf', tf) //TODO: move this somewhere else in the future
