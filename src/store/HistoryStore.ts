import type { Shape } from '@/common/definitions/Shape'
import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'

export enum HistoryEventType {
  SHAPE_DRAWN,
  SHAPE_DELETED
}

export interface ShapeDrawnEvent {
  type: HistoryEventType.SHAPE_DRAWN
  shape: Shape
}

export interface ShapeDeletedEvent {
  type: HistoryEventType.SHAPE_DELETED
  shape: Shape
}

type HistoryEvent = ShapeDrawnEvent | ShapeDeletedEvent

export const useHistoryStore = defineStore('history', () => {
  const undoBuffer: Ref<Array<HistoryEvent>> = ref([])
  const redoBuffer: Ref<Array<HistoryEvent>> = ref([])
  const isUndoPossible = computed(() => {
    return undoBuffer.value.length > 0
  })

  function pushEvent(event: HistoryEvent) {
    redoBuffer.value.length = 0 /* clears the array */
    undoBuffer.value.push(event)
  }

  function popEvent(): HistoryEvent {
    const event = undoBuffer.value.pop()!
    redoBuffer.value.push(event)
    return event
  }

  return {
    isUndoPossible,
    pushEvent,
    popEvent
  }
})
