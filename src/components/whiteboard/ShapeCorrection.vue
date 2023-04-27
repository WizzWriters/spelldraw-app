<script setup lang="ts">
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { usePointerTracker } from '@/common/composables/PointerTracker'
import { EShapeCorrectionState, useMagicStore } from '@/store/MagicStore'
import { computed, onMounted, ref, watch, type Ref } from 'vue'
import { storeToRefs } from 'pinia'
import Logger from 'js-logger'
import type { Shape } from '@/common/definitions/Geometry'
import ShapeCorrector from '@/services/correction/ShapeCorrector'
import { useCanvasStore } from '@/store/CanvasStore'

library.add(faCheck)
library.add(faTimes)

const logger = Logger.get('ShapeCorrection.vue')
const shapeCorrector = new ShapeCorrector()

const magicStore = useMagicStore()
const canvasStore = useCanvasStore()

const tooltipRef: Ref<HTMLElement | null> = ref(null)
const isTooltipShown = ref(false)
const isStatusShown = ref(false)
const isTooltipTracking = ref(false)
const wasCorrectionSuccessful = ref(true)

const tooltipPosition = computed(() => {
  if (!isTooltipTracking.value) {
    const boundingRect = tooltipRef.value?.getBoundingClientRect()
    if (!boundingRect) return { xCoordinate: 0, yCoordinate: 0 }
    return { xCoordinate: boundingRect.left, yCoordinate: boundingRect.top }
  }

  return {
    xCoordinate:
      pointerPosition.value.xCoordinate - (tooltipRef?.value?.clientWidth || 0),
    yCoordinate:
      pointerPosition.value.yCoordinate - (tooltipRef?.value?.clientHeight || 0)
  }
})

let correctionPromise: Promise<Shape | null>

function startCorrection() {
  isTooltipTracking.value = true
  isStatusShown.value = false
  isTooltipShown.value = true
  let currentlyDrawnShape = canvasStore.currentlyDrawnShape
  if (currentlyDrawnShape) {
    correctionPromise = shapeCorrector.correct(currentlyDrawnShape)
    logger.debug('Shape correction started')
  }
}

async function commitCorrection() {
  isTooltipTracking.value = false
  isStatusShown.value = true
  let correction = await correctionPromise

  if (!correction) {
    wasCorrectionSuccessful.value = false
    logger.debug('Shape correction failed successfully :)')
    return
  }

  wasCorrectionSuccessful.value = true
  canvasStore.currentlyDrawnShape = null
  canvasStore.drawnShapes.push(correction)
  logger.debug('Shape correction commited')
}

function hideTooltip() {
  isTooltipShown.value = false
}

function handleUnexpectedTransition(
  previousState: EShapeCorrectionState,
  nextState: EShapeCorrectionState
) {
  logger.warn(
    `Unexpected state transition from ${previousState} to` + ` ${nextState}`
  )
}

function handleTransitionFromIdle(nextState: EShapeCorrectionState) {
  switch (nextState) {
    case EShapeCorrectionState.STARTED:
      startCorrection()
      break
    default:
      handleUnexpectedTransition(EShapeCorrectionState.IDLE, nextState)
      break
  }
}

function handleTransitionFromStarted(nextState: EShapeCorrectionState) {
  switch (nextState) {
    case EShapeCorrectionState.IDLE:
      hideTooltip()
      break
    case EShapeCorrectionState.REQUESTED:
      commitCorrection()
      setTimeout(hideTooltip, 300)
      break
    default:
      handleUnexpectedTransition(EShapeCorrectionState.STARTED, nextState)
      break
  }
}

function handleTransitionFromRequested(nextState: EShapeCorrectionState) {
  switch (nextState) {
    case EShapeCorrectionState.IDLE:
      /* Nothing to do here */
      break
    default:
      handleUnexpectedTransition(EShapeCorrectionState.REQUESTED, nextState)
      break
  }
}

/* TODO: Draw states and transitions for this DFA */
const { shapeCorrectionState } = storeToRefs(magicStore)
watch(shapeCorrectionState, (nextState, previousState) => {
  switch (previousState) {
    case EShapeCorrectionState.IDLE:
      handleTransitionFromIdle(nextState)
      break
    case EShapeCorrectionState.STARTED:
      handleTransitionFromStarted(nextState)
      break
    case EShapeCorrectionState.REQUESTED:
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
  tooltipRef.value?.addEventListener('*', (event) => {
    console.log('Ladies and gentlemens, we got him:')
    console.error(event)
  })
})
</script>

<template>
  <Transition>
    <div
      v-if="isTooltipShown"
      id="tooltip"
      class="box p-2 has-text-centered"
      ref="tooltipRef"
      :style="
        `top: ${tooltipPosition.yCoordinate}px;` +
        `left: ${tooltipPosition.xCoordinate}px;`
      "
    >
      <p
        v-if="isStatusShown && wasCorrectionSuccessful"
        class="has-text-success p-0"
      >
        <FontAwesomeIcon icon="fa-check"></FontAwesomeIcon>
      </p>
      <p
        v-else-if="isStatusShown && !wasCorrectionSuccessful"
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
#tooltip {
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
