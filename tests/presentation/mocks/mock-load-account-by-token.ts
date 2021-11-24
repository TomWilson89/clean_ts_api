import { mockAccountModel } from '@/tests/domain/mocks'
import { AccountModel } from '@domain/models'
import { LoadAccountByToken } from '@domain/usecases'

export class LoadAccountByTokenStub implements LoadAccountByToken {
  async load(accessToken: string, role?: string): Promise<AccountModel> {
    return mockAccountModel()
  }
}
