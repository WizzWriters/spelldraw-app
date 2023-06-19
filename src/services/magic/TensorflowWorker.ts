import * as tf from '@tensorflow/tfjs'
import Logger from 'js-logger'
import type { Dictionary } from 'lodash'
import LoggerHelper from '@/helpers/LoggerHelper'

LoggerHelper.initializeLogger()
const logger = Logger.get(self.name)

async function init(name: string) {
  return await tf.loadLayersModel(`/models/${name}/model.json`)
}

async function call(model, content) {
  const raw = model.call(tf.tensor(content), {}) as [tf.Tensor<tf.Rank>]
  const arr = await raw[0].array()
  logger.trace(content, '===>', arr)
  return arr
}

function meta(model) {
  logger.trace(model)
  return model.getConfig().name as Dictionary<any>
}

const model = await init(self.name)
logger.debug('Model initialized!', model)
self.onmessage = async (message) => {
  if (!message.data) postMessage(meta(model))
  else postMessage(await call(model, message.data))
}
