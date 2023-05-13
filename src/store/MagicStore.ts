import { defineStore } from 'pinia'
import { ref } from 'vue'

export enum ECorrectionRequestState {
  IDLE,
  START,
  COMMIT
}

export const useMagicStore = defineStore('magic', () => {
  const shapeCorrectionEnabled = ref(false)
  const textPredictionEnabled = ref(false)
  const correctionRequestState = ref(ECorrectionRequestState.IDLE)
  const maxActivationStep = ref(0)
  const activationStep = ref(0)

  return {
    shapeCorrectionEnabled,
    textPredictionEnabled,
    correctionRequestState,
    activationStep,
    maxActivationStep
  }
})
