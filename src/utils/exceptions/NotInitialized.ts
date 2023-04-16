export class NotInitializedError extends Error {
  constructor() {
    super('Model not initialized')
  }
}
