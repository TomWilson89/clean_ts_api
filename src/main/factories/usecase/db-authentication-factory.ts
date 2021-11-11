import { DbAuthentication } from '../../../data/usecases'
import { Authentication } from '../../../domain/usecases'
import {
  AccountMongoRepository,
  BcryptAdapter,
  JwtAdapter
} from '../../../infra'
import env from '../../config/env'

export const makeAuthentication = (): Authentication => {
  const salt = 12

  const accountMongoRepository = new AccountMongoRepository()
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const dbAuthentication = new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository
  )

  return dbAuthentication
}
