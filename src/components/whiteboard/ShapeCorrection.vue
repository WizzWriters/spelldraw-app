<script setup lang="ts">
import { usePointerTracker } from '@/common/composables/PointerTracker'
import { ECorrectionRequestState, useMagicStore } from '@/store/MagicStore'
import { computed, onMounted, ref, watch, type Ref } from 'vue'
import { storeToRefs } from 'pinia'
import Logger from 'js-logger'
import type { Shape } from '@/common/definitions/Geometry'
import ShapeCorrector from '@/services/correction/ShapeCorrector'
import { useCanvasStore } from '@/store/CanvasStore'

const logger = Logger.get('ShapeCorrection.vue')
const shapeCorrector = new ShapeCorrector()

const magicStore = useMagicStore()
const canvasStore = useCanvasStore()

const loaderRef: Ref<HTMLElement | null> = ref(null)
const loaderState = ref({
  isShown: false,
  isStatusShown: false,
  isTracking: false,
  wasCorrectionSuccessful: false
})

const loaderPosition = computed(() => {
  if (!loaderState.value.isTracking) {
    const boundingRect = loaderRef.value?.getBoundingClientRect()
    if (!boundingRect) return { xCoordinate: 0, yCoordinate: 0 }
    return { xCoordinate: boundingRect.left, yCoordinate: boundingRect.top }
  }

  return {
    xCoordinate:
      pointerPosition.value.xCoordinate - (loaderRef?.value?.clientWidth || 0),
    yCoordinate:
      pointerPosition.value.yCoordinate - (loaderRef?.value?.clientHeight || 0)
  }
})

let correctionPromise: Promise<Shape | null>

function startCorrection() {
  loaderState.value.isTracking = true
  loaderState.value.isStatusShown = false
  loaderState.value.isShown = true
  let currentlyDrawnShape = canvasStore.currentlyDrawnShape
  if (currentlyDrawnShape) {
    correctionPromise = shapeCorrector.correct(currentlyDrawnShape)
    logger.debug('Shape correction started')
  }
}

async function commitCorrection() {
  loaderState.value.isTracking = false
  loaderState.value.isStatusShown = true
  let correction = await correctionPromise

  if (!correction) {
    loaderState.value.wasCorrectionSuccessful = false
    logger.debug('Shape correction failed successfully :)')
    return
  }

  loaderState.value.wasCorrectionSuccessful = true
  canvasStore.currentlyDrawnShape = null
  canvasStore.drawnShapes.push(correction)
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

function handleTransitionFromStarted(nextState: ECorrectionRequestState) {
  switch (nextState) {
    case ECorrectionRequestState.IDLE:
      hideLoader()
      break
    case ECorrectionRequestState.COMMIT:
      commitCorrection()
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
const { shapeCorrectionState } = storeToRefs(magicStore)
watch(shapeCorrectionState, (nextState, previousState) => {
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

const pointerPosition = usePointerTracker()

onMounted(async () => {
  await shapeCorrector.init()

  /* Remove when the hunt ends */
  loaderRef.value?.addEventListener('*', (event) => {
    console.log('Ladies and gentlemens, we got him:')
    console.error(event)
  })
})
</script>

<template>
  <Transition>
    <div
      v-if="loaderState.isShown"
      id="loader"
      class="box p-2 has-text-centered"
      ref="loaderRef"
      :style="
        `top: ${loaderPosition.yCoordinate}px;` +
        `left: ${loaderPosition.xCoordinate}px;`
      "
    >
      <p
        v-if="loaderState.isStatusShown && loaderState.wasCorrectionSuccessful"
        class="has-text-success p-0"
      >
        <FontAwesomeIcon icon="fa-check"></FontAwesomeIcon>
      </p>
      <p
        v-else-if="
          loaderState.isStatusShown && !loaderState.wasCorrectionSuccessful
        "
        class="has-text-danger p-0"
      >
        <FontAwesomeIcon icon="fa-times"></FontAwesomeIcon>
      </p>
      <progress
        v-else
        class="progress is-small is-primary"
        :value="magicStore.activationStep"
        :max="magicStore.maxActivationStep"
      ></progress>
    </div>
  </Transition>
</template>

<style lang="scss">
#loader {
  position: fixed;
  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;
  width: 50px;
  height: 40px;
  display: flex;
  align-items: center;

  p {
    width: 100%;
  }
}

.v-enter-active {
  transition: opacity 0.2s ease;
}

.v-leave-active {
  transition: opacity 1s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
