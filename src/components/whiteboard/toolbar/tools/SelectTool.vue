<script setup lang="ts">
import { Point } from '@/common/definitions/Geometry'
import { BuiltinPointerIcon, EPointerEvent } from '@/common/definitions/Pointer'
import { Polygon } from '@/common/definitions/Shape'
import { getPositionOnCanvas } from '@/helpers/CanvasHelper'
import { useCanvasStore } from '@/store/CanvasStore'
import { useToolbarStore } from '@/store/ToolbarStore'
import Logger from 'js-logger'
import { storeToRefs } from 'pinia'
import { onMounted, watch, type Ref } from 'vue'
import ToolButton from './ToolButton.vue'

const props = defineProps<{
  isActive: Boolean
}>()

const logger = Logger.get('SelectTool')
const toolbarStore = useToolbarStore()
const canvasStore = useCanvasStore()
const { currentlyDrawnShape } = storeToRefs(canvasStore)

function updateSelectBox(currentPoint: Point) {
  if (!currentlyDrawnShape.value)
    currentlyDrawnShape.value = new Polygon(Array(4).fill(currentPoint))

  let selectBox = currentlyDrawnShape as Ref<Polygon>
  let startCorner = selectBox.value.pointList[0]
  selectBox.value.pointList[1] = new Point(
    currentPoint.xCoordinate,
    startCorner.yCoordinate
  )
  selectBox.value.pointList[2] = currentPoint
  selectBox.value.pointList[3] = new Point(
    startCorner.xCoordinate,
    currentPoint.yCoordinate
  )
}

const handlePointerEvent = (eventType: EPointerEvent, event: PointerEvent) => {
  const pointerPosition = getPositionOnCanvas({
    xCoordinate: event.clientX,
    yCoordinate: event.clientY
  })
  const currentPoint = Point.fromPointerPosition(pointerPosition)
  switch (eventType) {
    case EPointerEvent.POINTER_DOWN:
      updateSelectBox(currentPoint)
      break
    case EPointerEvent.POINTER_UP:
    case EPointerEvent.POINTER_LEFT:
      currentlyDrawnShape.value = null
      break
    case EPointerEvent.POINTER_MOVED:
      if (!currentlyDrawnShape.value) return
      updateSelectBox(currentPoint)
      break
    default:
      logger.warn(`Received unexpected event: ${eventType}`)
      break
  }
}

onMounted(() => {
  const pointerIcon = new BuiltinPointerIcon('crosshair')

  function activateTool() {
    toolbarStore.activeTool = { pointerIcon, handlePointerEvent }
    logger.debug('Tool activated')
  }

  function deactivateTool() {
    logger.debug('Tool deactivated')
  }

  watch(
    () => props.isActive,
    (newValue, oldValue) => {
      if (!oldValue && newValue) activateTool()
      else if (oldValue && !newValue) deactivateTool()
    }
  )
})
</script>

<template>
  <ToolButton name="Select" :is-active="props.isActive">
    <FontAwesomeIcon icon="fa-arrow-pointer" />
  </ToolButton>
</template>
