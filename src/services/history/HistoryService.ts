import { useHistoryStore } from '@/store/history/HistoryStore'
import type IHistoryEvent from './IHistoryEvent'
import AggregateEvent from '@/store/history/event/AggregateEvent'
import KeyboardService from '../keyboard/KeyboardService'

class HistoryService {
  private aggregating = false
  private aggragateBuffer: Array<IHistoryEvent> = []

  constructor() {
    const canvasKeyboard = KeyboardService.get('canvas')
    canvasKeyboard.registerCallback(['Control', 'z'], () => this.undo())
    canvasKeyboard.registerCallback(['Control', 'Shift', 'Z'], () =>
      this.redo()
    )
    canvasKeyboard.registerCallback(['Control', 'y'], () => this.redo())
  }

  public undo() {
    const historyStore = useHistoryStore()
    const lastEvent = historyStore.popEvent()
    if (!lastEvent) return
    lastEvent.undo()
  }

  public redo() {
    const historyStore = useHistoryStore()
    const revertedEvent = historyStore.unpopEvent()
    if (!revertedEvent) return
    revertedEvent.redo()
  }

  public pushEvent(event: IHistoryEvent) {
    if (this.aggregating) return this.pushToAggragateBuffer(event)
    const historyStore = useHistoryStore()
    historyStore.pushEvent(event)
  }

  public popEvent() {
    const historyStore = useHistoryStore()
    return historyStore.popEvent()
  }

  public startAggregating() {
    this.aggregating = true
  }

  public stopAggregating() {
    this.aggregating = false
    this.pushAggragateBuffer()
  }

  private pushAggragateBuffer() {
    const aggregateEvent = new AggregateEvent(this.aggragateBuffer)
    const historyStore = useHistoryStore()
    historyStore.pushEvent(aggregateEvent)
    this.aggragateBuffer = []
  }

  private pushToAggragateBuffer(event: IHistoryEvent) {
    this.aggragateBuffer.push(event)
  }
}

export default new HistoryService()
