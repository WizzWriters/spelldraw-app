<script setup lang="ts">
import { RgbColor } from '@/common/definitions/Color'
import { Point, Rectangle } from '@/common/definitions/Geometry'
import { BuiltinPointerIcon, EPointerEvent } from '@/common/definitions/Pointer'
import { Polygon } from '@/common/definitions/Shape'
import { getPositionOnCanvas } from '@/helpers/CanvasHelper'
import EventBus, { EShapeEvent } from '@/services/bus/EventBus'
import StallDetector from '@/services/canvas/StallDetector'
import { useCanvasStore } from '@/store/CanvasStore'
import { useMagicStore } from '@/store/MagicStore'
import { useToolbarStore } from '@/store/ToolbarStore'
import Logger from 'js-logger'
import { storeToRefs } from 'pinia'
import { onMounted, watch, type Ref } from 'vue'
import TextRecognition from '../../magic/TextRecognition.vue'
import ToolButton from './ToolButton.vue'

const SELECT_BOX_FILL = new RgbColor(37, 150, 190, 0.1)
const SELECT_BOX_STROKE = new RgbColor(51, 173, 255)

const emit = defineEmits<{ (e: 'click'): void }>()
const props = defineProps<{
  isActive: Boolean
}>()

const logger = Logger.get('SelectTool')
const toolbarStore = useToolbarStore()
const canvasStore = useCanvasStore()
const magicStore = useMagicStore()

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

function polygonPointListOfSelectBox(selectBox: Rectangle) {
  return [
    new Point(selectBox.left, selectBox.top),
    new Point(selectBox.right, selectBox.top),
    new Point(selectBox.right, selectBox.bottom),
    new Point(selectBox.left, selectBox.bottom)
  ]
}

function emitCheckSelectionEvent(selectBox: Rectangle) {
  EventBus.emit(EShapeEvent.CHECK_SELECTION, { selectBox })
}

function newPolygonOfSelectBox(selectBox: Rectangle) {
  return new Polygon(
    polygonPointListOfSelectBox(selectBox),
    SELECT_BOX_STROKE,
    SELECT_BOX_FILL
  )
}

function updatePolygon(polygon: Ref<Polygon>, selectBox: Rectangle) {
  polygon.value.pointList = polygonPointListOfSelectBox(selectBox)
}

const handlePointerEvent =
  (stallDetector: StallDetector) =>
  (eventType: EPointerEvent, event: PointerEvent) => {
    const pointerPosition = getPositionOnCanvas({
      xCoordinate: event.clientX,
      yCoordinate: event.clientY
    })
    const currentPoint = Point.fromPointerPosition(pointerPosition)
    switch (eventType) {
      case EPointerEvent.POINTER_DOWN: {
        startPoint = currentPoint
        const selectBox = getSelectBox(currentPoint)
        emitCheckSelectionEvent(selectBox)
        currentlyDrawnShape.value = newPolygonOfSelectBox(selectBox)
        stallDetector.startDetecting()
        break
      }
      case EPointerEvent.POINTER_UP:
      case EPointerEvent.POINTER_LEFT:
        stallDetector.stopDetecting()
        currentlyDrawnShape.value = null
        startPoint = null
        break
      case EPointerEvent.POINTER_MOVED: {
        if (!currentlyDrawnShape.value) return
        const selectBox = getSelectBox(currentPoint)
        emitCheckSelectionEvent(selectBox)
        updatePolygon(currentlyDrawnShape as Ref<Polygon>, selectBox)
        break
      }
      default:
        logger.warn(`Received unexpected event: ${eventType}`)
        break
    }
  }

onMounted(() => {
  const stallDetector = new StallDetector()
  const pointerIcon = new BuiltinPointerIcon('crosshair')

  function activateTool() {
    magicStore.textRecognitionEnabled = true
    toolbarStore.activeTool = {
      pointerIcon,
      handlePointerEvent: handlePointerEvent(stallDetector)
    }
    logger.debug('Tool activated')
  }

  function deactivateTool() {
    magicStore.textRecognitionEnabled = false
    toolbarStore.clearSelectedShapes()
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
  <ToolButton name="Select" :is-active="props.isActive" @click="emit('click')">
    <FontAwesomeIcon id="select-icon" icon="fa-object-group" />
  </ToolButton>
  <TextRecognition />
</template>
