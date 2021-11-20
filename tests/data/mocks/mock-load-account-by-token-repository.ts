import { LoadAccountByTokenRepository } from '../../../src/data/protocols/db'

export class LoadAccountByTokenRepositoryStub
  implements LoadAccountByTokenRepository
{
  async loadByToken(accessToken: string, role?: string): Promise<any> {
    const fakeAccount = {
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    }

    return fakeAccount
  }
}
