import { Decrypter } from '@data/protocols'
import faker from 'faker'
export class DecryypterSpy implements Decrypter {
  plainText: string
  cipherText = faker.datatype.uuid()
  async decrypt(plainText: string): Promise<string> {
    this.plainText = plainText
    return this.cipherText
  }
}
