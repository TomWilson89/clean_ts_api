import { DbLoadAccountByToken } from '../../../data/usecases'
import { LoadAccountByToken } from '../../../domain/usecases'
import { AccountMongoRepository, JwtAdapter } from '../../../infra'
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
