import * as tf from '@tensorflow/tfjs'
import Logger from 'js-logger'
import type { ILogger } from 'js-logger'
import lodash from 'lodash'
import pin from '@/helpers/Pinner'
import TensorflowModel from './TensorflowModel'
import {
  AsyncInit,
  RequiresAsyncInit,
  AsyncInitialized
} from '@/utils/decorators/AsyncInit'
import { MissingMetadata } from '@/utils/exceptions/MissingMetadata'

class CtcDecoder {
  private classes: string

  constructor(classes: string) {
    this.classes = classes
  }

  public decode(timesteps: number[][]) {
    const path = this.bestPath(timesteps)
    const mergedPath = this.mergePath(path)
    const clearedPath = this.clearPath(mergedPath)
    return this.path2text(clearedPath)
  }

  private bestPath(timesteps: number[][]) {
    return timesteps.map((t) => tf.argMax(t).dataSync()[0])
  }

  private mergePath(path: number[]) {
    return path.reduce(
      (acc, token) => (lodash.last(acc) !== token ? [...acc, token] : acc),
      [] as number[]
    )
  }

  private clearPath(path: number[]) {
    const separator = this.classes.length
    return path.filter((token) => token !== separator)
  }

  private path2text(path: number[]) {
    return path.map((token) => this.classes[token]).join('')
  }
}

@AsyncInitialized
export default class TextOracle {
  public model: TensorflowModel
  public ctc!: CtcDecoder
  protected logger: ILogger

  constructor() {
    this.model = new TensorflowModel('TextOracle/oracle')
    this.logger = Logger.get('Oracle')
    pin('oracle', this)
  }

  @AsyncInit
  public async init() {
    await this.model.init()

    if (!this.model.meta().characters) throw new MissingMetadata()
    this.ctc = new CtcDecoder(this.model.meta().characters)
  }

  @RequiresAsyncInit
  public async call(image: tf.Tensor3D): Promise<string> {
    const preds = this.model.call(tf.expandDims(image))
    const codes = await tf.squeeze(preds[0]).array()
    const text = this.ctc.decode(codes as number[][])
    this.logger.debug(text)
    return text
  }
}
