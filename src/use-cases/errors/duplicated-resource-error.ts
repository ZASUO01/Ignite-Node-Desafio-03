export class DuplicatedResourceError extends Error {
  constructor() {
    super('The resource for this key already exists')
  }
}
