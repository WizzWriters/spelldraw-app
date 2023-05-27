<script setup lang="ts">
import ComplexShape from '@/common/definitions/ComplexShape'
import type { TextBox } from '@/common/definitions/Shape'
import TextPredictor from '@/services/correction/TextPredictor'
import { useCanvasStore } from '@/store/CanvasStore'
import { ECorrectionRequestState, useMagicStore } from '@/store/MagicStore'
import { useToolbarStore } from '@/store/ToolbarStore'
import Logger from 'js-logger'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import CorrectionLoader from './CorrectionLoader.vue'

const logger = Logger.get('TextPrediction.vue')
const textPredictor = new TextPredictor()
const magicStore = useMagicStore()
const toolbarStore = useToolbarStore()
const canvasStore = useCanvasStore()

let predictionPromise: Promise<TextBox | null>
let shapeBeingRecognized: ComplexShape | null = null

const loaderState = ref({
  isShown: false,
  isLoading: true,
  isTrackingPointer: false,
  wasCorrectionSuccessful: false
})

function eraseComplexShape(shape: ComplexShape) {
  for (const fragment of shape.fragments) {
    canvasStore.removeDrawnShapeById(fragment.id)
  }
}

function showLoadingLoader() {
  loaderState.value.isTrackingPointer = true
  loaderState.value.isLoading = true
  loaderState.value.isShown = true
}

async function commitPrediction() {
  loaderState.value.isTrackingPointer = false
  loaderState.value.isLoading = false
  const prediction = await predictionPromise

  if (!prediction) {
    loaderState.value.wasCorrectionSuccessful = false
    logger.debug('No words recognized')
    return
  }

  loaderState.value.wasCorrectionSuccessful = true
  canvasStore.drawnShapes.push(prediction)
  eraseComplexShape(shapeBeingRecognized!)
  shapeBeingRecognized = null
}

function startPrediction() {
  showLoadingLoader()
  const selectedShapes = canvasStore.drawnShapes.filter((shape) =>
    toolbarStore.selectedShapesIds.has(shape.id)
  )
  const complexShape = new ComplexShape(selectedShapes)
  shapeBeingRecognized = complexShape
  predictionPromise = textPredictor.predict(complexShape)
}

function hideLoader() {
  loaderState.value.isShown = false
}

function handleUnexpectedTransition(
  previousState: ECorrectionRequestState,
  nextState: ECorrectionRequestState
) {
  logger.warn(
    `Unexpected state transition from ${previousState} to ${nextState}`
  )
}

function handleTransitionFromIdle(nextState: ECorrectionRequestState) {
  switch (nextState) {
    case ECorrectionRequestState.START: {
      startPrediction()
      break
    }
    default:
      handleUnexpectedTransition(ECorrectionRequestState.IDLE, nextState)
      break
  }
}

function handleTransitionFromStarted(nextState: ECorrectionRequestState) {
  switch (nextState) {
    case ECorrectionRequestState.IDLE:
      hideLoader()
      shapeBeingRecognized = null
      break
    case ECorrectionRequestState.COMMIT:
      commitPrediction()
      setTimeout(hideLoader, 300)
      break
    default:
      handleUnexpectedTransition(ECorrectionRequestState.START, nextState)
      break
  }
}

function handleTransitionFromRequested(nextState: ECorrectionRequestState) {
  switch (nextState) {
    case ECorrectionRequestState.IDLE:
      /* Nothing to do here */
      break
    default:
      handleUnexpectedTransition(ECorrectionRequestState.COMMIT, nextState)
      break
  }
}

const { correctionRequestState } = storeToRefs(magicStore)
watch(correctionRequestState, (nextState, previousState) => {
  if (!magicStore.textPredictionEnabled) return

  switch (previousState) {
    case ECorrectionRequestState.IDLE:
      handleTransitionFromIdle(nextState)
      break
    case ECorrectionRequestState.START:
      handleTransitionFromStarted(nextState)
      break
    case ECorrectionRequestState.COMMIT:
      handleTransitionFromRequested(nextState)
      break
    default:
      handleUnexpectedTransition(previousState, nextState)
      break
  }
})

onMounted(async () => {
  await textPredictor.init()
})
</script>

<template>
  <CorrectionLoader
    :is-shown="loaderState.isShown"
    :is-loading="loaderState.isLoading"
    :is-tracking-pointer="loaderState.isTrackingPointer"
    :status="loaderState.wasCorrectionSuccessful"
    :value="magicStore.activationStep"
    :max-value="magicStore.maxActivationStep"
  />
</template>
