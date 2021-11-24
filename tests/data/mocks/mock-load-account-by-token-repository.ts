import { mockAccountModel } from '@/tests/domain/mocks'
import { LoadAccountByTokenRepository } from '@data/protocols/'

export class LoadAccountByTokenRepositoryStub
  implements LoadAccountByTokenRepository
{
  async loadByToken(accessToken: string, role?: string): Promise<any> {
    return mockAccountModel()
  }
}
