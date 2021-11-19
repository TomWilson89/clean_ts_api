export class AccessDeniedError extends Error {
  constructor() {
    super('Access AccessDeniedError')
    this.name = 'AccessDeniedError'
  }
}
