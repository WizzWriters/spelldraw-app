<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { onMounted, watch } from 'vue'
import ToolButton from './ToolButton.vue'
import { BuiltinPointerIcon, EPointerEvent } from '@/common/definitions/Pointer'
import { useToolbarStore } from '@/store/ToolbarStore'
import Logger from 'js-logger'
import { Point } from '@/common/definitions/Geometry'
import { useCanvasStore } from '@/store/CanvasStore'
import EventBus, {
  EMouseEvent,
  EventCallback,
  type IMouseWheelPayload
} from '@/services/bus/EventBus'
import type { ITool } from '@/common/definitions/Tool'

const props = defineProps<{
  isActive: boolean
  isDisabled: boolean
}>()

const logger = Logger.get('MoveTool')
const toolbarStore = useToolbarStore()
const canvasStore = useCanvasStore()
let startingPosition: Point | null = null
let startingOffset: Point | null = null
let moving = false
let savedTool: ITool | null = null

const handlePointerEvent = (eventType: EPointerEvent, event: PointerEvent) => {
  switch (eventType) {
    case EPointerEvent.POINTER_DOWN:
      startingPosition = new Point(event.clientX, event.clientY)
      startingOffset = new Point(
        canvasStore.canvasOffset.x,
        canvasStore.canvasOffset.y
      )
      moving = true
      break
    case EPointerEvent.POINTER_UP:
    case EPointerEvent.POINTER_LEFT:
      startingPosition = null
      startingOffset = null
      moving = false

      /* Restore previous tool if it was is saved */
      if (savedTool) {
        toolbarStore.activeTool = savedTool
        savedTool = null
      }
      break
    case EPointerEvent.POINTER_MOVED: {
      if (!moving) return
      const currentPosition = new Point(event.clientX, event.clientY)
      const newOffset = startingOffset!.add(
        startingPosition!.subtract(currentPosition)
      )
      canvasStore.canvasOffset = {
        x: newOffset.xCoordinate,
        y: newOffset.yCoordinate
      }
      break
    }
    default:
      break
  }
}

onMounted(() => {
  const pointerIcon = new BuiltinPointerIcon('grab')

  function activateTool() {
    toolbarStore.activeTool = { pointerIcon, handlePointerEvent }
    logger.debug('Tool activated')
  }

  function deactivateTool() {
    logger.debug('Tool deactivated')
  }

  /* Add support for moving around with mouse wheel press */
  const wheelPressedCallback = new EventCallback<IMouseWheelPayload>((p) => {
    handlePointerEvent(EPointerEvent.POINTER_DOWN, p.event)
    savedTool = toolbarStore.activeTool
    toolbarStore.activeTool = { pointerIcon, handlePointerEvent }
  })
  const wheelReleasedCallback = new EventCallback<IMouseWheelPayload>((p) => {
    handlePointerEvent(EPointerEvent.POINTER_UP, p.event)
  })
  EventBus.subscribe(EMouseEvent.MOUSE_WHEEL_PRESSED, wheelPressedCallback)
  EventBus.subscribe(EMouseEvent.MOUSE_WHEEL_RELEASED, wheelReleasedCallback)

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
    id="move-tool"
    name="Move"
    :is-active="props.isActive"
    :is-disabled="props.isDisabled"
  >
    <FontAwesomeIcon :icon="['fas', 'arrows-up-down-left-right']" />
  </ToolButton>
</template>

<style lang="scss">
#move-tool {
  order: 2;
}
</style>
