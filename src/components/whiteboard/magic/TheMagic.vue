<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import HandwritingRecognition from './HandwritingRecognition.vue'
import ShapeCorrection from './ShapeCorrection.vue'
import Logger from 'js-logger'

const logger = Logger.get('TheMagic.vue')

const initState = reactive({
  shapeCorrectionReady: false,
  hadwritingRecognitionReady: false
})

const ready = computed(() => {
  return initState.shapeCorrectionReady && initState.hadwritingRecognitionReady
})

const emit = defineEmits<{ (e: 'magicReady'): void }>()

function handleShapeCorrectionReady() {
  initState.shapeCorrectionReady = true
  logger.debug('Shape correction ready!')
}

function handleHandwritingRecognitionReady() {
  initState.hadwritingRecognitionReady = true
  logger.debug('Handwriting recognition ready!')
}

watch(ready, (newValue) => {
  if (!newValue) return
  logger.debug('ML components ready!')
  emit('magicReady')
})
</script>
<template>
  <span>
    <ShapeCorrection
      @shape-correction-ready="handleShapeCorrectionReady"
    ></ShapeCorrection>
    <HandwritingRecognition
      @handwriting-recognition-ready="handleHandwritingRecognitionReady"
    ></HandwritingRecognition>
  </span>
</template>
