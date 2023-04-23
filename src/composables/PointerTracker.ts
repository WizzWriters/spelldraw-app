import type { IPointerPosition } from '@/services/canvas/Pointer'
import { onMounted, onUnmounted, ref, type Ref } from 'vue'

export function usePointerTracker() {
  const pointerPosition: Ref<IPointerPosition> = ref({
    xCoordinate: 0,
    yCoordinate: 0
  })

  function updatePointerPosition(event: PointerEvent) {
    pointerPosition.value.xCoordinate = event.clientX
    pointerPosition.value.yCoordinate = event.clientY
  }

  onMounted(() => {
    document.addEventListener('pointermove', updatePointerPosition)
    document.addEventListener('pointerdown', updatePointerPosition)
  })
  onUnmounted(() => {
    document.removeEventListener('pointermove', updatePointerPosition)
    document.removeEventListener('pointerdown', updatePointerPosition)
  })

  return pointerPosition
}
