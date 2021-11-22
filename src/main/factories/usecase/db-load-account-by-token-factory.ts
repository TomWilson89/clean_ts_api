import { DbLoadAccountByToken } from '@data/usecases'
import { LoadAccountByToken } from '@domain/usecases'
import { JwtAdapter } from '@infra/cryptography'
import { AccountMongoRepository } from '@infra/db'
import env from '../../config/env'

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const loadAccountByTokenRepository = new AccountMongoRepository()
  const loadAccountByToken = new DbLoadAccountByToken(
    jwtAdapter,
    loadAccountByTokenRepository
  )
  return loadAccountByToken
}
