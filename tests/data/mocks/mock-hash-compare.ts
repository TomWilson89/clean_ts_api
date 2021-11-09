import { HashedComparer } from '../../../src/data/protocols'

export class HashedCompareStub implements HashedComparer {
  async compare(password: string, hash: string): Promise<boolean> {
    return await Promise.resolve(true)
  }
}
