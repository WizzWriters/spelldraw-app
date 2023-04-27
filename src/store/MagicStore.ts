import { defineStore } from 'pinia'
import { ref } from 'vue'

export enum EShapeCorrectionState {
  IDLE,
  STARTED,
  REQUESTED
}

export const useMagicStore = defineStore('magic', () => {
  const shapeCorrectionState = ref(EShapeCorrectionState.IDLE)
  const maxActivationStep = ref(0)
  const activationStep = ref(0)

  return { shapeCorrectionState, activationStep, maxActivationStep }
})
