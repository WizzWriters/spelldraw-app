import type { IPointerPosition } from '@/common/definitions/Pointer'
import { getPositionOnCanvas } from '@/helpers/CanvasHelper'
import IoConnection from '@/services/connection/IoConnection'
import { useBoardStore } from './BoardStore'

/* Limit to about 15 times per second */
const THROTTLE_TIMEOUT = 1000 / 15

/* For performance reasons this is done outside Pinia */
const PointerStore = (function () {
  let throttle = false
  let pointerStore: {
    pointerPosition: IPointerPosition
    setPointerPosition: (position: IPointerPosition) => void
    broadcastPosition: () => void
  } | null

  function broadcastPosition() {
    const boardStore = useBoardStore()
    const relativePosition = getPositionOnCanvas(pointerStore!.pointerPosition)
    IoConnection.emit('position_update', {
      board_id: boardStore.boardId,
      board_user_id: boardStore.boardUserId,
      position: relativePosition
    })
  }

  function setPointerPosition(position: IPointerPosition) {
    pointerStore!.pointerPosition = position
    if (throttle) return
    broadcastPosition()
    throttle = true
    setTimeout(() => (throttle = false), THROTTLE_TIMEOUT)
  }

  /* This is as hacky as it looks, the point is to return a singleton */
  /* and the reason is to make it look like a Pinia store API */
  return {
    usePointerStore: function () {
      if (!pointerStore) {
        pointerStore = {
          pointerPosition: { xCoordinate: 0, yCoordinate: 0 },
          setPointerPosition,
          broadcastPosition
        }
      }
      return pointerStore
    }
  }
})()

export const usePointerStore = PointerStore.usePointerStore
