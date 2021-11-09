import { LoadAccountByEmailRepositoryStub } from '../../../tests/data/mocks'
import { Authentication, AuthenticationModel } from '../../domain/usecases'

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepositoryStub
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
  }

  async auth(authentication: AuthenticationModel): Promise<string> {
    await this.loadAccountByEmailRepository.load(authentication.email)
    return null
  }
}
