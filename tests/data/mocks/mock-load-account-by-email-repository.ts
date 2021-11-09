/* eslint-disable @typescript-eslint/brace-style */
/* eslint-disable @typescript-eslint/indent */
import { LoadAccountByEmailRepository } from '../../../src/data/protocols'
import { AccountModel } from '../../../src/domain/models'

export class LoadAccountByEmailRepositoryStub
  implements LoadAccountByEmailRepository
{
  async load(email: string): Promise<AccountModel> {
    const account: AccountModel = {
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    return account
  }
}
