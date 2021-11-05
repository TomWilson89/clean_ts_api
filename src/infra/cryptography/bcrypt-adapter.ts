import { Encrypter } from '@/data/protocols'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Encrypter {
  constructor(private readonly salt: number) {
    this.salt = salt
  }

  async encrypt(value: string): Promise<string> {
    await bcrypt.hash(value, this.salt)
    return 'any_token'
  }
}
