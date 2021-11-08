import {
  Authentication,
  AuthenticationModel
} from '../../../src/domain/usecases'

export class AuthenticationStub implements Authentication {
  async auth(authentication: AuthenticationModel): Promise<string> {
    return 'any_token'
  }
}
