<script setup lang="ts">
import { ECorrectionRequestState, useMagicStore } from '@/store/MagicStore'
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import Logger from 'js-logger'
import type { Shape } from '@/common/definitions/Shape'
import ShapeCorrector from '@/services/correction/ShapeCorrector'
import CorrectionLoader from './CorrectionLoader.vue'
import CanvasService from '@/services/canvas/CanvasService'

const logger = Logger.get('ShapeCorrection.vue')
const shapeCorrector = new ShapeCorrector()

const magicStore = useMagicStore()
const canvasService = new CanvasService()

const emit = defineEmits<{ (e: 'shapeCorrectionReady'): void }>()

const loaderState = ref({
  isShown: false,
  isLoading: true,
  isTrackingPointer: false,
  wasCorrectionSuccessful: false
})

let correctionPromise: Promise<Shape | null>

function startCorrection() {
  loaderState.value.isTrackingPointer = true
  loaderState.value.isLoading = true
  loaderState.value.isShown = true
  const currentlyDrawnShape = canvasService.getCurrentlyDrawnShape()
  if (currentlyDrawnShape) {
    correctionPromise = shapeCorrector.correct(currentlyDrawnShape)
    logger.debug('Shape correction started')
  }
}

async function commitCorrection() {
  loaderState.value.isTrackingPointer = false
  const correction = await correctionPromise

  if (!correction) {
    loaderState.value.wasCorrectionSuccessful = false
    loaderState.value.isLoading = false
    logger.debug('Shape correction failed successfully :)')
    return
  }

  loaderState.value.wasCorrectionSuccessful = true
  loaderState.value.isLoading = false
  canvasService.setCurrentlyDrawnShape(null)
  canvasService.drawShape(correction)
  logger.debug('Shape correction commited')
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
      startCorrection()
      break
    default:
      handleUnexpectedTransition(ECorrectionRequestState.IDLE, nextState)
      break
  }
}

async function handleTransitionFromStarted(nextState: ECorrectionRequestState) {
  switch (nextState) {
    case ECorrectionRequestState.IDLE:
      hideLoader()
      break
    case ECorrectionRequestState.COMMIT:
      await commitCorrection()
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

/* TODO: Draw states and transitions for this DFA */
const { correctionRequestState } = storeToRefs(magicStore)
watch(correctionRequestState, (nextState, previousState) => {
  if (!magicStore.shapeCorrectionEnabled) return

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
  await shapeCorrector.init()
  logger.debug('Shape corrector initialized!')
  emit('shapeCorrectionReady')
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
