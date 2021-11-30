import { mockAccountModel } from '@/tests/domain/mocks'
import { LoadAccountByEmailRepository } from '@data/protocols'
import { AccountModel } from '@domain/models'

export class LoadAccountByEmailRepositorySpy
  implements LoadAccountByEmailRepository
{
  email: string
  result = mockAccountModel()

  async loadByEmail(email: string): Promise<AccountModel> {
    this.email = email
    return this.result
  }
}
