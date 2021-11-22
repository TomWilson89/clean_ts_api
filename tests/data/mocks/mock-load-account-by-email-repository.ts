import { LoadAccountByEmailRepository } from '@data/protocols'
import { AccountModel } from '@domain/models'

export class LoadAccountByEmailRepositoryStub
  implements LoadAccountByEmailRepository
{
  email: string
  account: AccountModel = {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'hashed_password'
  }

  async loadByEmail(email: string): Promise<AccountModel> {
    this.email = email
    return this.account
  }
}
