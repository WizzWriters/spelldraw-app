<script setup lang="ts">
import { RgbColor } from '@/common/definitions/Color'
import { Point, Rectangle } from '@/common/definitions/Geometry'
import { BuiltinPointerIcon, EPointerEvent } from '@/common/definitions/Pointer'
import { Polygon } from '@/common/definitions/Shape'
import { getPositionOnCanvas } from '@/helpers/CanvasHelper'
import EventBus, { EShapeEvent } from '@/services/bus/EventBus'
import { useCanvasStore } from '@/store/CanvasStore'
import { useToolbarStore } from '@/store/ToolbarStore'
import Logger from 'js-logger'
import { storeToRefs } from 'pinia'
import { onMounted, watch } from 'vue'
import ToolButton from './ToolButton.vue'

const SELECT_BOX_FILL = new RgbColor(37, 150, 190, 0.1)
const SELECT_BOX_STROKE = new RgbColor(51, 173, 255)

const props = defineProps<{
  isActive: Boolean
}>()

const logger = Logger.get('SelectTool')
const toolbarStore = useToolbarStore()
const canvasStore = useCanvasStore()
const { currentlyDrawnShape } = storeToRefs(canvasStore)
let startPoint: Point | null = null

function getSelectBox(currentPoint: Point): Rectangle {
  let start = startPoint!
  return new Rectangle(
    Math.min(currentPoint.xCoordinate, start.xCoordinate),
    Math.max(currentPoint.xCoordinate, start.xCoordinate),
    Math.max(currentPoint.yCoordinate, start.yCoordinate),
    Math.min(currentPoint.yCoordinate, start.yCoordinate)
  )
}

function polygonOfSelectBox(selectBox: Rectangle) {
  return new Polygon(
    [
      new Point(selectBox.left, selectBox.top),
      new Point(selectBox.right, selectBox.top),
      new Point(selectBox.right, selectBox.bottom),
      new Point(selectBox.left, selectBox.bottom)
    ],
    SELECT_BOX_STROKE,
    SELECT_BOX_FILL
  )
}

function emitCheckSelectionEvent(selectBox: Rectangle) {
  EventBus.emit(EShapeEvent.CHECK_SELECTION, { selectBox })
}

const handlePointerEvent = (eventType: EPointerEvent, event: PointerEvent) => {
  const pointerPosition = getPositionOnCanvas({
    xCoordinate: event.clientX,
    yCoordinate: event.clientY
  })
  const currentPoint = Point.fromPointerPosition(pointerPosition)
  switch (eventType) {
    case EPointerEvent.POINTER_DOWN: {
      startPoint = currentPoint
      const selectBox = getSelectBox(currentPoint)
      currentlyDrawnShape.value = polygonOfSelectBox(selectBox)
      emitCheckSelectionEvent(selectBox)
      break
    }
    case EPointerEvent.POINTER_UP:
    case EPointerEvent.POINTER_LEFT:
      currentlyDrawnShape.value = null
      startPoint = null
      break
    case EPointerEvent.POINTER_MOVED: {
      if (!currentlyDrawnShape.value) return
      const selectBox = getSelectBox(currentPoint)
      currentlyDrawnShape.value = polygonOfSelectBox(selectBox)
      emitCheckSelectionEvent(selectBox)
      break
    }
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
    toolbarStore.clearSelectedShapes()
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
    <FontAwesomeIcon id="select-icon" icon="fa-object-group" />
  </ToolButton>
</template>
