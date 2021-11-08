import { DbAddAccount } from '../../../data/usecases'
import {
  AccountMongoRepository,
  BcryptAdapter,
  LogMongoRepository
} from '../../../infra'
import { SignUpController } from '../../../presentation/controller'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators'
import { makeSignUpValidation } from './signup-validation'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const addAccountRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, addAccountRepository)

  const signupController = new SignUpController(
    dbAddAccount,
    makeSignUpValidation()
  )
  const logMongoRepository = new LogMongoRepository()
  const logControllerDecorator = new LogControllerDecorator(
    signupController,
    logMongoRepository
  )
  return logControllerDecorator
}
