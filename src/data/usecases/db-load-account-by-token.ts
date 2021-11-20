import { AccountModel } from '../../domain/models'
import { LoadAccountByToken } from '../../domain/usecases'
import { Decrypter } from '../protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(private readonly decrypter: Decrypter) {}
  async load(accessToken: string, role?: string): Promise<AccountModel> {
    await this.decrypter.decrypt(accessToken)
    return null
  }
}
