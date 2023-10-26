import type { Tensor } from '@/common/definitions/Tensor'
import type { Dictionary } from 'lodash'

export enum TensorflowWorkerMessageType {
  INIT_REQUEST,
  INIT_RESPONSE,
  META_REQUEST,
  META_RESPONSE,
  CALL_REQUEST,
  CALL_RESPONSE
}

export interface TensorflowWorkerInitRequest {
  type: TensorflowWorkerMessageType.INIT_REQUEST
}

export interface TensorflowWorkerInitResponse {
  type: TensorflowWorkerMessageType.INIT_RESPONSE
}

export interface TensorflowWorkerMetaRequest {
  type: TensorflowWorkerMessageType.META_REQUEST
}

export interface TensorflowWorkerMetaResponse {
  type: TensorflowWorkerMessageType.META_RESPONSE
  meta: Dictionary<any>
}

export interface TensorflowWorkerCallRequest {
  type: TensorflowWorkerMessageType.CALL_REQUEST
  tensor: Tensor
}

export interface TensorflowWorkerCallResponse {
  type: TensorflowWorkerMessageType.CALL_RESPONSE
  tensor: Tensor
}

export type TensorflowWorkerRequest =
  | TensorflowWorkerCallRequest
  | TensorflowWorkerMetaRequest
  | TensorflowWorkerInitRequest

export type TensorflowWorkerResponse =
  | TensorflowWorkerMetaResponse
  | TensorflowWorkerCallResponse
  | TensorflowWorkerInitResponse

export type TensorflowWorkerMessage =
  | TensorflowWorkerRequest
  | TensorflowWorkerResponse
