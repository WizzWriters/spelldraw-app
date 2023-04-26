import type { IPointerPosition } from '@/common/definitions/Pointer'
import { useCanvasStore } from '@/store/CanvasStore'

export function getPositionOnCanvas(pointerPosition: IPointerPosition) {
  const canvasStore = useCanvasStore()
  const canvasPosition = canvasStore.canvasPosition
  return {
    xCoordinate: pointerPosition.xCoordinate - canvasPosition.left,
    yCoordinate: pointerPosition.yCoordinate - canvasPosition.top
  }
}
