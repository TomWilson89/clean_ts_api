import { Hasher } from '../../../src/data/protocols'

export class HasherStub implements Hasher {
  async hash(value: string): Promise<string> {
    return await new Promise((resolve) => resolve('hashed_password'))
  }
}
