<script setup lang="ts">
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { usePointerTracker } from '@/common/composables/PointerTracker'
import { EShapeCorrectionState, useMagicStore } from '@/store/MagicStore'
import { computed, ref, watch, type Ref } from 'vue'
import { storeToRefs } from 'pinia'
import Logger from 'js-logger'

library.add(faCheck)
library.add(faTimes)

const logger = Logger.get('ShapeCorrection.vue')

const magicStore = useMagicStore()

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

function startCorrection() {
  isTooltipTracking.value = true
  isStatusShown.value = false
  isTooltipShown.value = true
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
      isTooltipTracking.value = false
      wasCorrectionSuccessful.value = false
      isStatusShown.value = true
      break
    default:
      handleUnexpectedTransition(EShapeCorrectionState.STARTED, nextState)
      break
  }
}

function handleTransitionFromRequested(nextState: EShapeCorrectionState) {
  switch (nextState) {
    case EShapeCorrectionState.IDLE:
      setTimeout(hideTooltip, 300)
      break
    default:
      handleUnexpectedTransition(EShapeCorrectionState.REQUESTED, nextState)
      break
  }
}

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
