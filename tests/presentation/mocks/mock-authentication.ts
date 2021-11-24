import { Authentication, AuthenticationParams } from '@domain/usecases'

export class AuthenticationStub implements Authentication {
  async auth(authentication: AuthenticationParams): Promise<string> {
    return 'any_token'
  }
}
