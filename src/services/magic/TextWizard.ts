import pin from '@/helpers/Pinner'
import * as tf from '@tensorflow/tfjs'
import { NotInitializedError } from './utils'
import TensorflowModel from './TensorflowModel'

class TextWizard {
  public model: TensorflowModel | undefined

  public async init(): Promise<TextWizard> {
    pin('text', this)
    this.model = await new TensorflowModel('TextWizard').init()
    return this
  }

  public async call(image: tf.Tensor3D): Promise<tf.Tensor3D> {
    //NYI
    if (!this.model) throw new NotInitializedError()
    return tf.reshape(image, [128, 32, 1])
  }
}

export default (async () => await new TextWizard().init())()
