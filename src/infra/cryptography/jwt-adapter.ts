import jwt from 'jsonwebtoken'
import { Decrypter, Encrypter } from '../../data/protocols'

type JwtTypes = Encrypter & Decrypter

export class JwtAdapter implements JwtTypes {
  constructor(private readonly secret: string) {}

  async encrypt(value: string): Promise<string> {
    const token = jwt.sign({ id: value }, this.secret)
    return token
  }

  async decrypt(value: string): Promise<string> {
    await jwt.verify(value, this.secret)
    return null
  }
}
