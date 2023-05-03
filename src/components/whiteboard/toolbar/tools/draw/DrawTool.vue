<script setup lang="ts">
import { Point } from '@/common/definitions/Geometry'
import { EPointerEvent, type IPointerIcon } from '@/common/definitions/Pointer'
import { getPositionOnCanvas } from '@/helpers/CanvasHelper'
import ShapeCollector from '@/services/canvas/ShapeCollector'
import { useCanvasStore } from '@/store/CanvasStore'
import { ECorrectionRequestState, useMagicStore } from '@/store/MagicStore'
import { useToolbarStore } from '@/store/ToolbarStore'
import Logger from 'js-logger'
import { onMounted, watch } from 'vue'
import ToolButton from '../ToolButton.vue'

const logger = Logger.get('DrawTool')
const toolbarStore = useToolbarStore()
const canvasStore = useCanvasStore()
const magicStore = useMagicStore()

const emit = defineEmits<{ (e: 'drawToolReady'): void }>()
const props = defineProps<{
  isActive: Boolean
}>()

const handlePointerEvent =
  (shapeCollector: ShapeCollector) =>
  (eventType: EPointerEvent, event: PointerEvent) => {
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
        magicStore.shapeCorrectionState = ECorrectionRequestState.IDLE
        const collectedShape = shapeCollector.collectShape(point)
        if (collectedShape) canvasStore.drawnShapes.push(collectedShape)
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
  let shapeCollector = new ShapeCollector()
  const pointerIcon: IPointerIcon = {
    url: '/pointers/pencil-solid.svg',
    hotspot: new Point(0, 0)
  }

  watch(
    () => props.isActive,
    (newValue, oldValue) => {
      if (oldValue || !newValue) return
      toolbarStore.activeTool = {
        pointerIcon,
        handlePointerEvent: handlePointerEvent(shapeCollector)
      }
      logger.debug('Tool activated')
    },
    { immediate: true }
  )

  emit('drawToolReady')
})
</script>

<template>
  <ToolButton :is-active="props.isActive">
    <FontAwesomeIcon icon="fa-pencil" />
  </ToolButton>
</template>
