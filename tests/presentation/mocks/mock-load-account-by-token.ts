import { mockAccountModel } from '@/tests/domain/mocks'
import { AccountModel } from '@domain/models'
import { LoadAccountByToken } from '@domain/usecases'

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  accessToken: string
  role: string
  result = mockAccountModel()
  async load(accessToken: string, role?: string): Promise<AccountModel> {
    this.accessToken = accessToken
    this.role = role
    return this.result
  }
}
