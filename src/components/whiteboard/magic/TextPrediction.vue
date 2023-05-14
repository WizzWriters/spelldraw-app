<script setup lang="ts">
import TextPredictor from '@/services/correction/TextPredictor'
import { ECorrectionRequestState, useMagicStore } from '@/store/MagicStore'
import Logger from 'js-logger'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import CorrectionLoader from './CorrectionLoader.vue'

const logger = Logger.get('TextPrediction.vue')
const textPredictor = new TextPredictor()
const magicStore = useMagicStore()

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
    case ECorrectionRequestState.START:
      showLoadingLoader()
      // trigger prediction here
      break
    default:
      handleUnexpectedTransition(ECorrectionRequestState.IDLE, nextState)
      break
  }
}

function handleTransitionFromStarted(nextState: ECorrectionRequestState) {
  switch (nextState) {
    case ECorrectionRequestState.IDLE:
      hideLoader()
      break
    case ECorrectionRequestState.COMMIT:
      // commit prediction here
      loaderState.value.isTrackingPointer = false
      loaderState.value.wasCorrectionSuccessful = false
      loaderState.value.isLoading = false
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
