export default interface IHistoryEvent {
  undo(): void
  redo(): void
}
