import type { IPointerPosition } from '@/common/definitions/Pointer'

/* For performance reasons this is done outside Pinia */
const PointerStore = (function () {
  let pointerStore: { pointerPosition: IPointerPosition } | null
  return {
    usePointerStore: function () {
      if (!pointerStore) {
        pointerStore = {
          pointerPosition: {
            xCoordinate: 0,
            yCoordinate: 0
          }
        }
      }
      return pointerStore
    }
  }
})()

export const usePointerStore = PointerStore.usePointerStore
