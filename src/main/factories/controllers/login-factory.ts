import { DbAuthentication } from '../../../data/usecases'
import {
  AccountMongoRepository,
  BcryptAdapter,
  JwtAdapter,
  LogMongoRepository
} from '../../../infra'
import { LoginController } from '../../../presentation/controller'
import { Controller } from '../../../presentation/protocols'
import env from '../../config/env'
import { LogControllerDecorator } from '../../decorators'
import { makeLoginValidation } from './login-validation-factory'

export const makeLoginController = (): Controller => {
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

  const loginController = new LoginController(
    dbAuthentication,
    makeLoginValidation()
  )

  const logMongoRepository = new LogMongoRepository()
  const logControllerDecorator = new LogControllerDecorator(
    loginController,
    logMongoRepository
  )

  return logControllerDecorator
}
