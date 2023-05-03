import type { EPointerEvent, IPointerIcon } from './Pointer'

export interface ITool {
  pointerIcon?: IPointerIcon
  handlePointerEvent(eventType: EPointerEvent, event: PointerEvent): void
}
