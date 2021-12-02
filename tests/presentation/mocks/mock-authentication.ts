import { Authentication } from '@domain/usecases'
import faker from 'faker'
export class AuthenticationSpy implements Authentication {
  params: Authentication.Params
  result = {
    accessToken: faker.datatype.uuid(),
    name: faker.name.firstName()
  }

  async auth(
    authentication: Authentication.Params
  ): Promise<Authentication.Result> {
    this.params = authentication
    return this.result
  }
}
