import { Authentication, AuthenticationParams } from '@domain/usecases'
import faker from 'faker'
export class AuthenticationSpy implements Authentication {
  params: AuthenticationParams
  result = faker.datatype.uuid()
  async auth(authentication: AuthenticationParams): Promise<string> {
    this.params = authentication
    return this.result
  }
}
