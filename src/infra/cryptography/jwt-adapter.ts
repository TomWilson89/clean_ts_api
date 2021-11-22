import { Decrypter, Encrypter } from '@data/protocols'
import jwt from 'jsonwebtoken'

type JwtTypes = Encrypter & Decrypter

export class JwtAdapter implements JwtTypes {
  constructor(private readonly secret: string) {}

  async encrypt(value: string): Promise<string> {
    const token = jwt.sign({ id: value }, this.secret)
    return token
  }

  async decrypt(token: string): Promise<string> {
    const value = (await jwt.verify(token, this.secret)) as string
    return value
  }
}
