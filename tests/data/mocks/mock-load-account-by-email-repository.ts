import { mockAccountModel } from '@/tests/domain/mocks'
import { LoadAccountByEmailRepository } from '@data/protocols'
import { AccountModel } from '@domain/models'

export class LoadAccountByEmailRepositoryStub
  implements LoadAccountByEmailRepository
{
  email: string

  async loadByEmail(email: string): Promise<AccountModel> {
    this.email = email
    return mockAccountModel()
  }
}
