import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'

export enum HistoryEventType {
  SHAPE_DRAWN
}

export interface ShapeDrawnEvent {
  type: HistoryEventType.SHAPE_DRAWN
  shapeId: string
}

type HistoryEvent = ShapeDrawnEvent

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
