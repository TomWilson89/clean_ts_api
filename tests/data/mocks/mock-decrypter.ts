import { Decrypter } from '@data/protocols'

export class DecryypterStub implements Decrypter {
  async decrypt(value: string): Promise<string> {
    return await Promise.resolve('any_value')
  }
}
