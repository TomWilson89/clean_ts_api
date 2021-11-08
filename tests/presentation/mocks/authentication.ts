import { Authentication } from '../../../src/domain/usecases'

export class AuthenticationStub implements Authentication {
  async auth(email: string, password: string): Promise<string> {
    return 'any_token'
  }
}
