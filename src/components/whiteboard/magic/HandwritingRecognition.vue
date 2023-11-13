<script setup lang="ts">
import ComplexShape from '@/common/definitions/ComplexShape'
import type { TextBox } from '@/common/definitions/Shape'
import HandwritingRecognizer from '@/services/correction/HandwritingRecognizer'
import { useCanvasStore } from '@/store/CanvasStore'
import { ECorrectionRequestState, useMagicStore } from '@/store/MagicStore'
import { useToolbarStore } from '@/store/ToolbarStore'
import Logger from 'js-logger'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import CorrectionLoader from './CorrectionLoader.vue'

const logger = Logger.get('TextPrediction.vue')

const emit = defineEmits<{ (e: 'handwritingRecognitionReady'): void }>()

const handwritingRecognizer = new HandwritingRecognizer()
const magicStore = useMagicStore()
const toolbarStore = useToolbarStore()
const canvasStore = useCanvasStore()

let recognitionPromise: Promise<TextBox | null>
let shapeBeingRecognized: ComplexShape | null = null

const loaderState = ref({
  isShown: false,
  isLoading: true,
  isTrackingPointer: false,
  wasCorrectionSuccessful: false
})

function showLoadingLoader() {
  loaderState.value.isTrackingPointer = true
  loaderState.value.isLoading = true
  loaderState.value.isShown = true
}

async function commitRecognition() {
  loaderState.value.isTrackingPointer = false
  const prediction = await recognitionPromise

  if (!prediction) {
    loaderState.value.wasCorrectionSuccessful = false
    loaderState.value.isLoading = false
    logger.debug('No words recognized')
    return
  }

  loaderState.value.wasCorrectionSuccessful = true
  loaderState.value.isLoading = false
  canvasStore.replaceShapes(shapeBeingRecognized!.fragments, prediction)
  shapeBeingRecognized = null
}

function startRecognition() {
  showLoadingLoader()
  const selectedShapes = canvasStore.drawnShapes.filter((shape) =>
    toolbarStore.selectedShapesIds.has(shape.id)
  )
  const complexShape = new ComplexShape(selectedShapes)
  shapeBeingRecognized = complexShape
  recognitionPromise = handwritingRecognizer.recognize(complexShape)
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
      startRecognition()
      break
    }
    default:
      handleUnexpectedTransition(ECorrectionRequestState.IDLE, nextState)
      break
  }
}

async function handleTransitionFromStarted(nextState: ECorrectionRequestState) {
  switch (nextState) {
    case ECorrectionRequestState.IDLE:
      hideLoader()
      shapeBeingRecognized = null
      break
    case ECorrectionRequestState.COMMIT:
      await commitRecognition()
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
  if (!magicStore.textRecognitionEnabled) return

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
  await handwritingRecognizer.init()
  logger.debug('Handwriting recognition initialized!')
  emit('handwritingRecognitionReady')
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
