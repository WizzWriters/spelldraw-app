<script setup lang="ts">
import { EPointerEvent } from '@/common/definitions/Pointer'
import { getPositionOnCanvas } from '@/helpers/CanvasHelper'
import ShapeCollector from '@/services/canvas/ShapeCollector'
import { useCanvasStore } from '@/store/CanvasStore'
import { EShapeCorrectionState, useMagicStore } from '@/store/MagicStore'
import { useToolbarStore } from '@/store/ToolbarStore'
import Logger from 'js-logger'
import { onMounted } from 'vue'

const logger = Logger.get('DrawTool')
const toolbarStore = useToolbarStore()
const canvasStore = useCanvasStore()
const magicStore = useMagicStore()

const emit = defineEmits<{ (e: 'drawToolReady'): void }>()

const handlePointerEvent =
  (shapeCollector: ShapeCollector) =>
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
        magicStore.shapeCorrectionState = EShapeCorrectionState.IDLE
        const collectedShape = shapeCollector.collectShape(point)
        if (collectedShape) canvasStore.drawnShapes.push(collectedShape)
        break
      }
      default:
        logger.warn(`Received unexpected event: ${eventType}`)
    }
  }

onMounted(() => {
  let shapeCollector = new ShapeCollector()
  /* Hardcode as active tool for now */
  toolbarStore.activeTool = {
    handlePointerEvent: handlePointerEvent(shapeCollector)
  }
  emit('drawToolReady')
})
</script>

<template>
  <div>
    <!-- Empty for now -->
  </div>
</template>
