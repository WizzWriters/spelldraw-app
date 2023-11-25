import type { Shape } from '@/common/definitions/Shape'
import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'

export enum HistoryEventType {
  SHAPE_DRAWN,
  SHAPE_DELETED,
  SHAPE_UPDATED,
  SHAPES_REPLACED
}

export interface ShapeDrawnEvent {
  type: HistoryEventType.SHAPE_DRAWN
  shape: Shape
}

export interface ShapeDeletedEvent {
  type: HistoryEventType.SHAPE_DELETED
  shape: Shape
}

export interface ShapesReplacedEvent {
  type: HistoryEventType.SHAPES_REPLACED
  oldShapes: Array<Shape>
  newShape: Shape
}

export interface ShapeUpdatedEvent {
  type: HistoryEventType.SHAPE_UPDATED
  oldShape: Shape
  newShape: Shape
}

export type HistoryEvent =
  | ShapeDrawnEvent
  | ShapeDeletedEvent
  | ShapeUpdatedEvent
  | ShapesReplacedEvent

export const useHistoryStore = defineStore('history', () => {
  const undoBuffer: Ref<Array<HistoryEvent>> = ref([])
  const redoBuffer: Ref<Array<HistoryEvent>> = ref([])
  const isUndoPossible = computed(() => {
    return undoBuffer.value.length > 0
  })
  const isRedoPossible = computed(() => {
    return redoBuffer.value.length > 0
  })

  function pushEvent(event: HistoryEvent) {
    redoBuffer.value.length = 0 /* clears the array */
    undoBuffer.value.push(event)
  }

  function popEvent(): HistoryEvent | undefined {
    const event = undoBuffer.value.pop()
    if (!event) return
    redoBuffer.value.push(event)
    return event
  }

  function unpopEvent(): HistoryEvent | undefined {
    const event = redoBuffer.value.pop()
    if (!event) return
    undoBuffer.value.push(event)
    return event
  }

  return {
    isUndoPossible,
    isRedoPossible,
    pushEvent,
    popEvent,
    unpopEvent
  }
})
