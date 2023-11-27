<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { onMounted, watch } from 'vue'
import ToolButton from './ToolButton.vue'
import { BuiltinPointerIcon, EPointerEvent } from '@/common/definitions/Pointer'
import { useToolbarStore } from '@/store/ToolbarStore'
import Logger from 'js-logger'
import { Point } from '@/common/definitions/Geometry'
import { useCanvasStore } from '@/store/CanvasStore'

const props = defineProps<{
  isActive: Boolean
  isDisabled: Boolean
}>()

const logger = Logger.get('MoveTool')
const toolbarStore = useToolbarStore()
const canvasStore = useCanvasStore()
let startingPosition: Point | null = null
let startingOffset: Point | null = null
let moving = false

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
