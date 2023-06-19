import pin from '@/helpers/Pinner'
import * as tf from '@tensorflow/tfjs'
import lodash from 'lodash'
import { Point } from '@/common/definitions/Geometry'
import TensorflowModel from './TensorflowModel'

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
  public async classify(
    image: tf.Tensor3D
  ): Promise<[ShapeClassification, number]> {
    const dist = await this.call(await image.array())
    const shape = shapes[tf.argMax(dist).dataSync()[0]]
    const certainty = tf.max(dist).dataSync()[0]
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

  public async vertices(image: tf.Tensor3D) {
    const output = await this.call(await image.array())
    const vs = tf.reshape(output, [-1, 2]) as tf.Tensor2D
    return await this.sortClockwise(vs)
  }
}

export default class ShapeWizard {
  public static readonly INPUT_WIDTH = 70
  public static readonly INPUT_HEIGHT = 70
  public static readonly INPUT_PADDING = 0.15
  public static readonly INPUT_LINE_WIDTH = 2
  public static readonly INPUT_KEEP_PROPORTIONS = false

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

  public async call(
    image: tf.Tensor3D
  ): Promise<[ShapeClassification, Array<Point>]> {
    const [shape, certainty] = await this.classifier.classify(image)

    if (!this.regressors[shape]) return [shape, []]
    if (certainty < this.uncertaintyTolerance)
      return [ShapeClassification.OTHER, []]

    const vertices = await this.regressors[shape].vertices(image)
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
