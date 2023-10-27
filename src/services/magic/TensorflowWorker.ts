import * as tf from '@tensorflow/tfjs'
import Logger from 'js-logger'
import type { Dictionary } from 'lodash'
import LoggerHelper from '@/helpers/LoggerHelper'
import type { Tensor } from '@/common/definitions/Tensor'
import {
  TensorflowWorkerMessageType,
  type TensorflowWorkerCallResponse,
  type TensorflowWorkerRequest,
  type TensorflowWorkerResponse,
  type TensorflowWorkerMetaResponse,
  type TensorflowWorkerInitResponse
} from './TensorflowWorkerMessage'

async function call(model: tf.LayersModel, tensor: Tensor) {
  const input = tf.expandDims(tensor)
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

function handleModelMetaRequest(
  model: tf.LayersModel
): TensorflowWorkerMetaResponse {
  return {
    type: TensorflowWorkerMessageType.META_RESPONSE,
    meta: meta(model)
  }
}

async function handleModelCallRequest(
  tensor: Tensor,
  model: tf.LayersModel
): Promise<TensorflowWorkerCallResponse> {
  return {
    type: TensorflowWorkerMessageType.CALL_RESPONSE,
    tensor: ((await call(model, tensor)) as Tensor[])[0]
  }
}

async function handleInitRequest(
  model: tf.LayersModel
): Promise<TensorflowWorkerInitResponse> {
  /* Feed the model with dummy data to load it eagerly */
  const shape = model.inputs[0].shape.slice(1) as number[]
  model.call(tf.zeros([1, ...shape]), {})
  logger.debug('Model initialized!', model)
  return {
    type: TensorflowWorkerMessageType.INIT_RESPONSE
  }
}

function postResponse(port: MessagePort, response: TensorflowWorkerResponse) {
  port.postMessage(response)
}

async function handleRequest(
  request: TensorflowWorkerRequest,
  port: MessagePort,
  model: tf.LayersModel
) {
  let response: TensorflowWorkerResponse
  switch (request.type) {
    case TensorflowWorkerMessageType.CALL_REQUEST:
      response = await handleModelCallRequest(request.tensor, model)
      break
    case TensorflowWorkerMessageType.META_REQUEST:
      response = handleModelMetaRequest(model)
      break
    case TensorflowWorkerMessageType.INIT_REQUEST:
      response = await handleInitRequest(model)
      break
  }
  postResponse(port, response)
}

function handleMessage(model: tf.LayersModel) {
  return async (message: MessageEvent) => {
    const request = message.data as TensorflowWorkerRequest
    const port = message.ports[0]
    handleRequest(request, port, model)
  }
}

tf.loadLayersModel(modelUrl).then((model) => {
  queue.map(handleMessage(model))
  self.onmessage = handleMessage(model)
})
