import { Hasher } from '@data/protocols'
import faker from 'faker'
export class HasherSpy implements Hasher {
  cipherText = faker.datatype.uuid()
  plainText: string
  async hash(plainText: string): Promise<string> {
    this.plainText = plainText
    return this.cipherText
  }
}
