<script setup lang="ts">
import { Point, Segment } from '@/common/definitions/Geometry'
import {
  EPointerEvent,
  ExternalPointerIcon,
  type IPointerPosition
} from '@/common/definitions/Pointer'
import { getPositionOnCanvas } from '@/helpers/CanvasHelper'
import { useToolbarStore } from '@/store/ToolbarStore'
import Logger from 'js-logger'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import ToolButton from './ToolButton.vue'
import eraserPointerUrl from '@/assets/pointers/eraser-solid.svg?no-inline'
import EventBus, { EShapeEvent } from '@/services/bus/EventBus'
import CanvasService from '@/services/canvas/CanvasService'

const props = defineProps<{
  isActive: Boolean
  isDisabled: Boolean
}>()

const logger = Logger.get('EraserTool')
const toolbarStore = useToolbarStore()
const canvasService = new CanvasService()
const { intersectingShapesIds } = storeToRefs(toolbarStore)

const isErasing = ref(false)

/* TODO: Move this to separete file as it will be needed in other tools */
let lastReading: IPointerPosition | null = null
function getPointerHitline(pointerPosition: IPointerPosition) {
  const hitline = new Segment(
    Point.fromPointerPosition(lastReading ? lastReading : pointerPosition),
    Point.fromPointerPosition(pointerPosition)
  )
  lastReading = pointerPosition
  return hitline
}

function emitShapeEvents(pointerPosition: IPointerPosition) {
  EventBus.emit(EShapeEvent.CHECK_INTERSECTION, {
    pointerHitline: getPointerHitline(pointerPosition)
  })
}

const handlePointerEvent = (eventType: EPointerEvent, event: PointerEvent) => {
  const pointerPosition = getPositionOnCanvas({
    xCoordinate: event.clientX,
    yCoordinate: event.clientY
  })
  switch (eventType) {
    case EPointerEvent.POINTER_DOWN:
      isErasing.value = true
      break
    case EPointerEvent.POINTER_UP:
    case EPointerEvent.POINTER_LEFT:
      isErasing.value = false
      break
    case EPointerEvent.POINTER_MOVED:
      emitShapeEvents(pointerPosition)
      break
    default:
      logger.warn(`Received unexpected event: ${eventType}`)
      break
  }
}

watch(
  [intersectingShapesIds, isErasing],
  ([newIntersectingShapeIds, newIsErasing]) => {
    if (newIntersectingShapeIds.size == 0 || !newIsErasing) return
    for (const id of newIntersectingShapeIds) {
      canvasService.removeShapeById(id)
    }
    toolbarStore.clearIntersectingShapes()
  },
  { deep: true }
)

onMounted(() => {
  const pointerIcon = new ExternalPointerIcon(eraserPointerUrl, new Point(6, 3))

  function activateTool() {
    toolbarStore.activeTool = { pointerIcon, handlePointerEvent }
    logger.debug('Tool activated')
  }

  function deactivateTool() {
    lastReading = null
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
})
</script>

<template>
  <ToolButton
    name="Erase"
    :is-active="props.isActive"
    :is-disabled="props.isDisabled"
  >
    <FontAwesomeIcon icon="fa-eraser" />
  </ToolButton>
</template>
