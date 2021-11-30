import { Encrypter } from '@data/protocols'
import faker from 'faker'
export class EncrypterSpy implements Encrypter {
  plainText: string
  cipherValue = faker.datatype.uuid()
  async encrypt(plainText: string): Promise<string> {
    this.plainText = plainText
    return this.cipherValue
  }
}
