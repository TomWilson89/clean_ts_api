import { LoadAccountByEmailRepositoryStub } from '../../../tests/data/mocks'
import { Authentication, AuthenticationModel } from '../../domain/usecases'
import { HashedComparer } from '../protocols'

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepositoryStub,
    private readonly hashComparer: HashedComparer
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
  }

  async auth(authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(
      authentication.email
    )
    if (account) {
      await this.hashComparer.compare(authentication.password, account.password)
    }

    return null
  }
}
