import HistoryEvent from './HistoryEvent'
import type IHistoryEvent from '@/services/history/IHistoryEvent'

export default class AggregateEvent extends HistoryEvent {
  constructor(private events: IHistoryEvent[]) {
    super()
  }

  public undo() {
    for (let i = this.events.length - 1; i >= 0; i--) this.events[i].undo()
  }

  public redo() {
    for (const event of this.events) event.redo()
  }
}
