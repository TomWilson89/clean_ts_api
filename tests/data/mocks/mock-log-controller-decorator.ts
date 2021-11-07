import { LogErrorRepository } from '@/data/protocols'

export class LogErrorRepositoryStub implements LogErrorRepository {
  async log(stack: string): Promise<void> {
    return await Promise.resolve()
  }
}
