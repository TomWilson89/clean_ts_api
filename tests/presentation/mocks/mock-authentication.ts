import { AuthenticationModel } from '@domain/models'
import { Authentication, AuthenticationParams } from '@domain/usecases'
import faker from 'faker'
export class AuthenticationSpy implements Authentication {
  params: AuthenticationParams
  result = {
    accessToken: faker.datatype.uuid(),
    name: faker.name.firstName()
  }

  async auth(
    authentication: AuthenticationParams
  ): Promise<AuthenticationModel> {
    this.params = authentication
    return this.result
  }
}
