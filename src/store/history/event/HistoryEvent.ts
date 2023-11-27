import type IHistoryEvent from '@/services/history/IHistoryEvent'

export default abstract class HistoryEvent implements IHistoryEvent {
  public abstract undo(): void
  public abstract redo(): void
}
