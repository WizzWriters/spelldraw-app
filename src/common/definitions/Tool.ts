import type {
  EPointerEvent,
  BuiltinPointerIcon,
  ExternalPointerIcon
} from './Pointer'

export interface ITool {
  pointerIcon?: ExternalPointerIcon | BuiltinPointerIcon
  handlePointerEvent(eventType: EPointerEvent, event: PointerEvent): void
}
