<script setup lang="ts">
import { EPointerEvent } from '@/common/definitions/Pointer'
import { getPositionOnCanvas } from '@/helpers/CanvasHelper'
import ShapeCollector from '@/services/canvas/ShapeCollector'
import ShapeCorrector from '@/services/correction/ShapeCorrector'
import { useCanvasStore } from '@/store/CanvasStore'
import { useToolbarStore } from '@/store/ToolbarStore'
import { onMounted } from 'vue'

const toolbarStore = useToolbarStore()
const canvasStore = useCanvasStore()

const emit = defineEmits<{ (e: 'drawToolReady'): void }>()

const handlePointerEvent =
  (shapeCollector: ShapeCollector, shapeCorrector: ShapeCorrector) =>
  async (eventType: EPointerEvent, event: PointerEvent) => {
    const point = getPositionOnCanvas({
      xCoordinate: event.clientX,
      yCoordinate: event.clientY
    })

    switch (eventType) {
      case EPointerEvent.POINTER_DOWN:
        shapeCollector.startCollecting(point)
        break
      case EPointerEvent.POINTER_UP:
      case EPointerEvent.POINTER_LEFT: {
        const collectedShape = shapeCollector.collectShape(point)
        if (collectedShape) {
          let correctedShape = await shapeCorrector.correct(collectedShape)
          canvasStore.drawnShapes.push(correctedShape)
        }
        break
      }
      default:
        console.log('Err')
    }
  }

onMounted(async () => {
  let shapeCollector = new ShapeCollector()
  let shapeCorrector = new ShapeCorrector()
  await shapeCorrector.init()
  /* Hardcode as active tool for now */
  toolbarStore.activeTool = {
    handlePointerEvent: handlePointerEvent(shapeCollector, shapeCorrector)
  }
  emit('drawToolReady')
})
</script>

<template>
  <div>
    <!-- Empty for now -->
  </div>
</template>
