import { LoadAccountByEmailRepositoryStub } from '../../../tests/data/mocks'
import { Authentication, AuthenticationModel } from '../../domain/usecases'
import { HashedComparer, TokenGenerator } from '../protocols'

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepositoryStub,
    private readonly hashComparer: HashedComparer,
    private readonly tokenGenerator: TokenGenerator
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.tokenGenerator = tokenGenerator
  }

  async auth(authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(
      authentication.email
    )
    if (!account) {
      return null
    }

    const isValid = await this.hashComparer.compare(
      authentication.password,
      account.password
    )

    if (!isValid) {
      return null
    }
    await this.tokenGenerator.generate(account.id)
    return null
  }
}
