import type { EPointerEvent } from './Pointer'

export interface ITool {
  handlePointerEvent(eventType: EPointerEvent, event: PointerEvent): void
}
