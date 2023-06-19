import * as tf from '@tensorflow/tfjs'
import Logger from 'js-logger'
import type { Dictionary } from 'lodash'
import LoggerHelper from '@/helpers/LoggerHelper'
import type { Tensor } from './TensorflowModel'

async function call(x: Tensor) {
  const input = tf.expandDims(x)
  const output = (model.call(input, {}) as [tf.Tensor<tf.Rank>])[0]
  logger.trace(input, '===>', output)
  return await output.array()
}

function meta() {
  logger.trace(model)
  return model.getConfig().name as Dictionary<any>
}

async function handleMessage(message: MessageEvent) {
  const port = message.ports[0]
  if (!message.data) port.postMessage(meta())
  else port.postMessage(await call(message.data))
}

LoggerHelper.initializeLogger()
const logger = Logger.get(self.name)

const queue: MessageEvent[] = []
self.onmessage = (message: MessageEvent) => queue.push(message)

const currenUrl = new URL(import.meta.url)
const modelUrl =
  currenUrl.origin + import.meta.env.BASE_URL + `models/${self.name}/model.json`
const model = await tf.loadLayersModel(modelUrl)
logger.debug('Model initialized!', model)
queue.map(handleMessage)
self.onmessage = handleMessage
