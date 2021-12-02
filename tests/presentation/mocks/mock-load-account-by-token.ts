import { LoadAccountByToken } from '@domain/usecases'
import faker from 'faker'
export class LoadAccountByTokenSpy implements LoadAccountByToken {
  accessToken: string
  role: string
  result = {
    id: faker.datatype.uuid()
  }

  async load(
    accessToken: string,
    role?: string
  ): Promise<LoadAccountByToken.Result> {
    this.accessToken = accessToken
    this.role = role
    return this.result
  }
}
