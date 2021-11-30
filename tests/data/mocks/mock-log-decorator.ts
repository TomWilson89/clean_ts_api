import { LogErrorRepository } from '@data/protocols'

export class LogErrorRepositoryStub implements LogErrorRepository {
  stack: string
  async logError(stack: string): Promise<void> {
    this.stack = stack
    return await Promise.resolve()
  }
}
