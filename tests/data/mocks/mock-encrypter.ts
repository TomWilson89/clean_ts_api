import { Encrypter } from '@data/protocols'

export class EncrypterStub implements Encrypter {
  async encrypt(value: string): Promise<string> {
    return 'valid_token'
  }
}
