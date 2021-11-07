import { LogErrorRepository } from '../../../src/data/protocols'

export class LogErrorRepositoryStub implements LogErrorRepository {
  async logError(stack: string): Promise<void> {
    return await Promise.resolve()
  }
}
