import * as tf from '@tensorflow/tfjs'
import Logger from 'js-logger'
import type { Dictionary } from 'lodash'
import LoggerHelper from '@/helpers/LoggerHelper'
import type { Tensor } from './TensorflowModel'

async function call(model: tf.LayersModel, x: Tensor) {
  const input = tf.expandDims(x)
  const output = (model.call(input, {}) as [tf.Tensor<tf.Rank>])[0]
  logger.trace(input, '===>', output)
  return await output.array()
}

function meta(model: tf.LayersModel) {
  logger.trace(model)
  return model.getConfig().name as Dictionary<any>
}

LoggerHelper.initializeLogger()
const logger = Logger.get(self.name)

const queue: MessageEvent[] = []
self.onmessage = (message: MessageEvent) => queue.push(message)

const currenUrl = new URL(import.meta.url)
const modelUrl =
  currenUrl.origin + import.meta.env.BASE_URL + `models/${self.name}/model.json`

tf.loadLayersModel(modelUrl).then((model) => {
  async function handleMessage(message: MessageEvent) {
    const port = message.ports[0]
    if (!message.data) port.postMessage(meta(model))
    else port.postMessage(await call(model, message.data))
  }

  logger.debug('Model initialized!', model)
  model.call(tf.zeros([1, ...model.inputs[0].shape.slice(1)]), {})
  queue.map(handleMessage)
  self.onmessage = handleMessage
})
