import { Authentication, AuthenticationModel } from '../../domain/usecases'
import {
  Encrypter,
  HashedComparer,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository
} from '../protocols'

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashedComparer,
    private readonly encrypt: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.encrypt = encrypt
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
    const accessToken = await this.encrypt.encrypt(account.id)
    await this.updateAccessTokenRepository.update(account.id, accessToken)

    return accessToken
  }
}
