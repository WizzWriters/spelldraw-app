export class InvalidArguments extends Error {
  constructor(msg: string) {
    super('Invalid arguments received by: ' + msg)
  }
}
