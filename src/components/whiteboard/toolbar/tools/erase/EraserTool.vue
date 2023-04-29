<script setup lang="ts">
import { Segment } from '@/common/definitions/Geometry'
import {
  EPointerEvent,
  type IPointerPosition
} from '@/common/definitions/Pointer'
import { getPositionOnCanvas } from '@/helpers/CanvasHelper'
import { useToolbarStore } from '@/store/ToolbarStore'
import { useCanvasStore } from '@/store/CanvasStore'
import Logger from 'js-logger'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import ToolButton from '../ToolButton.vue'

const props = defineProps<{
  isActive: Boolean
}>()

const logger = Logger.get('EraserTool')
const toolbarStore = useToolbarStore()
const canvasStore = useCanvasStore()
const { intersectingShapesIds } = storeToRefs(toolbarStore)

const isErasing = ref(false)

/* TODO: Move this to separete file as it will be needed in other tools */
let lastReading: IPointerPosition | null = null
function getPointerHitline(pointerPosition: IPointerPosition) {
  const hitline = new Segment(
    lastReading ? lastReading : pointerPosition,
    pointerPosition
  )
  lastReading = pointerPosition
  return hitline
}

const handlePointerEvent = (eventType: EPointerEvent, event: PointerEvent) => {
  const pointerPosition = getPositionOnCanvas({
    xCoordinate: event.clientX,
    yCoordinate: event.clientY
  })
  switch (eventType) {
    case EPointerEvent.POINTER_DOWN:
      isErasing.value = true
      toolbarStore.pointerHitline = getPointerHitline(pointerPosition)
      break
    case EPointerEvent.POINTER_UP:
    case EPointerEvent.POINTER_LEFT:
      isErasing.value = false
      lastReading = null
      toolbarStore.pointerHitline = null
      break
    case EPointerEvent.POINTER_MOVED: {
      if (!isErasing.value) break
      toolbarStore.pointerHitline = getPointerHitline(pointerPosition)
      break
    }
    default:
      logger.warn(`Received unexpected event: ${eventType}`)
      break
  }
}

watch(
  intersectingShapesIds,
  (newValue) => {
    if (newValue.length == 0) return
    for (const id of newValue) {
      canvasStore.removeDrawnShapeById(id)
    }
    toolbarStore.clearIntersectingShapes()
  },
  { deep: true }
)

onMounted(() => {
  watch(
    () => props.isActive,
    (newValue, oldValue) => {
      if (oldValue || !newValue) return
      toolbarStore.activeTool = { handlePointerEvent }
      logger.debug('Tool activated')
    }
  )
})
</script>

<template>
  <ToolButton name="Erase" :is-active="props.isActive">
    <FontAwesomeIcon icon="fa-eraser" />
  </ToolButton>
</template>
