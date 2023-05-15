import pin from '@/helpers/Pinner'
import * as tf from '@tensorflow/tfjs'
import lodash from 'lodash'
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
    console.log('best ' + path)
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
  private characters: string
  public ctc!: CtcDecoder

  constructor() {
    this.model = new TensorflowModel('TextOracle/oracle')
    this.characters = ''
    pin('oracle', this)
  }

  @AsyncInit
  public async init() {
    await this.model.init()

    if (!this.model.meta().characters) throw new MissingMetadata()
    this.characters = this.model.meta().characters
    this.ctc = new CtcDecoder(this.characters)
  }

  @RequiresAsyncInit
  public async call(image: tf.Tensor3D): Promise<string> {
    const tokens = this.characters.length + 2
    const preds = this.model.call(tf.expandDims(image))
    console.log(preds)
    const codes = await tf.squeeze(preds[0]).array()
    return this.ctc.decode(codes as number[][])
  }
}
