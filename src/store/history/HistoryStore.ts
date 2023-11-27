import type IHistoryEvent from '@/services/history/IHistoryEvent'
import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'

export const useHistoryStore = defineStore('history', () => {
  const undoBuffer: Ref<Array<IHistoryEvent>> = ref([])
  const redoBuffer: Ref<Array<IHistoryEvent>> = ref([])

  const isUndoPossible = computed(() => {
    return undoBuffer.value.length > 0
  })
  const isRedoPossible = computed(() => {
    return redoBuffer.value.length > 0
  })

  function pushEvent(event: IHistoryEvent) {
    redoBuffer.value.length = 0 /* clears the array */
    undoBuffer.value.push(event)
  }

  function popEvent(): IHistoryEvent | undefined {
    const event = undoBuffer.value.pop()
    if (!event) return
    redoBuffer.value.push(event)
    return event
  }

  function unpopEvent(): IHistoryEvent | undefined {
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
