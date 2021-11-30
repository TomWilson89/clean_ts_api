import { mockAccountModel } from '@/tests/domain/mocks'
import { LoadAccountByTokenRepository } from '@data/protocols/'

export class LoadAccountByTokenRepositorySpy
  implements LoadAccountByTokenRepository
{
  accessToken: string
  role: string
  result = mockAccountModel()

  async loadByToken(accessToken: string, role?: string): Promise<any> {
    this.accessToken = accessToken
    this.role = role
    return this.result
  }
}
