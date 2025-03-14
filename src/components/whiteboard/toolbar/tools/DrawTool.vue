<script setup lang="ts">
import { Point } from '@/common/definitions/Geometry'
import {
  EPointerEvent,
  ExternalPointerIcon
} from '@/common/definitions/Pointer'
import { getPositionOnCanvas } from '@/helpers/CanvasHelper'
import ShapeCollector from '@/services/canvas/ShapeCollector'
import { ECorrectionRequestState, useMagicStore } from '@/store/MagicStore'
import { useToolbarStore } from '@/store/ToolbarStore'
import Logger from 'js-logger'
import { onMounted, watch } from 'vue'
import ToolButton from './ToolButton.vue'
import pencilPointerUrl from '@/assets/pointers/pencil-solid.svg?no-inline'
import StallDetector from '@/services/canvas/StallDetector'
import CanvasService from '@/services/canvas/CanvasService'

const logger = Logger.get('DrawTool')
const toolbarStore = useToolbarStore()
const canvasService = new CanvasService()
const magicStore = useMagicStore()

const emit = defineEmits<{ (e: 'drawToolReady'): void; (e: 'click'): void }>()
const props = defineProps<{
  isActive: boolean
  isDisabled: boolean
}>()

const handlePointerEvent =
  (shapeCollector: ShapeCollector, stallDetector: StallDetector) =>
  (eventType: EPointerEvent, event: PointerEvent) => {
    const pointerPosition = getPositionOnCanvas({
      xCoordinate: event.clientX,
      yCoordinate: event.clientY
    })
    const point = Point.fromPointerPosition(pointerPosition)

    switch (eventType) {
      case EPointerEvent.POINTER_DOWN:
        shapeCollector.startCollecting(point)
        stallDetector.startDetecting()
        break
      case EPointerEvent.POINTER_UP:
      case EPointerEvent.POINTER_LEFT: {
        magicStore.correctionRequestState = ECorrectionRequestState.IDLE
        const collectedShape = shapeCollector.collectShape(point)
        stallDetector.stopDetecting()
        if (collectedShape) canvasService.drawShape(collectedShape)
        break
      }
      case EPointerEvent.POINTER_MOVED:
        /* Nothing to do */
        break
      default:
        logger.warn(`Received unexpected event: ${eventType}`)
    }
  }

onMounted(() => {
  const shapeCollector = new ShapeCollector()
  const stallDetector = new StallDetector()
  const pointerIcon = new ExternalPointerIcon(pencilPointerUrl, new Point(0, 0))

  function activateTool() {
    magicStore.shapeCorrectionEnabled = true
    toolbarStore.activeTool = {
      pointerIcon,
      handlePointerEvent: handlePointerEvent(shapeCollector, stallDetector)
    }
    logger.debug('Tool activated')
  }

  function deactivateTool() {
    magicStore.shapeCorrectionEnabled = false
    logger.debug('Tool deactivated')
  }

  watch(
    () => props.isActive,
    (newValue, oldValue) => {
      if (!oldValue && newValue) activateTool()
      else if (oldValue && !newValue) deactivateTool()
    },
    { immediate: true }
  )

  emit('drawToolReady')
})
</script>

<template>
  <ToolButton
    name="Draw"
    :is-active="props.isActive"
    @click="emit('click')"
    :is-disabled="props.isDisabled"
  >
    <FontAwesomeIcon icon="fa-pencil" />
  </ToolButton>
</template>
