import { AccountModel } from '../../../src/domain/models'
import { LoadAccountByToken } from '../../../src/domain/usecases'

export class LoadAccountByTokenStub implements LoadAccountByToken {
  async load(accessToken: string, role?: string): Promise<AccountModel> {
    const fakeAccount = {
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }

    return fakeAccount
  }
}
