import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export enum HistoryEventType {
  SHAPE_DRAWN
}

interface ShapeDrawnEvent {
  type: HistoryEventType.SHAPE_DRAWN
  shapeId: string
}

type HistoryEvent = ShapeDrawnEvent

export const useHistoryStore = defineStore('history', () => {
  const undoBuffer: Ref<Array<HistoryEvent>> = ref([])
  const redoBuffer: Ref<Array<HistoryEvent>> = ref([])

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
    pushEvent,
    popEvent
  }
})
