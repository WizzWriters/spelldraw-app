import type { IPointerPosition } from '@/common/definitions/Pointer'
import { useCanvasStore } from '@/store/CanvasStore'

export function getPositionOnCanvas(pointerPosition: IPointerPosition) {
  const canvasStore = useCanvasStore()
  const canvasPosition = canvasStore.canvasPosition
  /* We need some unified vector implementation :) */
  return {
    xCoordinate:
      pointerPosition.xCoordinate -
      canvasPosition.left +
      canvasStore.canvasOffset.x,
    yCoordinate:
      pointerPosition.yCoordinate -
      canvasPosition.top +
      canvasStore.canvasOffset.y
  }
}
