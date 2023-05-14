import { Rectangle } from '@/common/definitions/Geometry'
import type { Shape } from '@/common/definitions/Shape'
import EventBus, {
  EShapeEvent,
  EventCallback,
  type ICheckSelectionPayload
} from '@/services/bus/EventBus'
import { useCanvasStore } from '@/store/CanvasStore'
import { useToolbarStore } from '@/store/ToolbarStore'
import { onMounted, onUnmounted, watch, type Ref } from 'vue'

export function useSelectionDetection(
  elementRef: Ref<HTMLElement | null>,
  shape: Ref<Shape>,
  enabled: Ref<Boolean>
) {
  const canvasStore = useCanvasStore()
  const toolbarStore = useToolbarStore()

  function domRectToRectangle(domRect: DOMRect) {
    const rectangle = new Rectangle(
      domRect.left,
      domRect.right,
      domRect.bottom,
      domRect.top
    )
    rectangle.move(
      -canvasStore.canvasPosition.left,
      -canvasStore.canvasPosition.top
    )
    return rectangle
  }

  function checkSelection(selectBox: Rectangle) {
    const boundingDomRect = elementRef.value!.getBoundingClientRect()
    const boundingRectangle = domRectToRectangle(boundingDomRect)
    return selectBox.encloses(boundingRectangle)
  }

  const selectionCallback = new EventCallback<ICheckSelectionPayload>(
    (payload) => {
      if (checkSelection(payload.selectBox))
        toolbarStore.addToSelectedShapes(shape.value.id)
      else toolbarStore.removeFromSelectedShapes(shape.value.id)
    }
  )

  function enable() {
    EventBus.subscribe(EShapeEvent.CHECK_SELECTION, selectionCallback)
  }

  function disable() {
    EventBus.unsubscribe(EShapeEvent.CHECK_SELECTION, selectionCallback)
  }

  onMounted(() => {
    if (enabled.value) enable()
  })

  onUnmounted(() => disable())

  watch(enabled, (newEnabled, oldEnabled) => {
    if (newEnabled && !oldEnabled) return enable()
    if (!newEnabled && oldEnabled) return disable()
  })
}
