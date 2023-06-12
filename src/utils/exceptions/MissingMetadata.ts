export class MissingMetadata extends Error {
  constructor() {
    super('Requested model metadata is missing')
  }
}
