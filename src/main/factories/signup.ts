import { DbAddAccount } from '../../data/usecases'
import {
  AccountMongoRepository,
  BcryptAdapter,
  EmailValidationAdapter,
  LogMongoRepository
} from '../../infra'
import { SignUpController } from '../../presentation/controller'
import { Controller } from '../../presentation/protocols'
import { LogControllerDecorator } from '../decorators'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const emailValidatorAdapter = new EmailValidationAdapter()
  const bcryptAdapter = new BcryptAdapter(salt)
  const addAccountRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, addAccountRepository)
  const signupController = new SignUpController(
    emailValidatorAdapter,
    dbAddAccount
  )
  const logMongoRepository = new LogMongoRepository()
  const logControllerDecorator = new LogControllerDecorator(
    signupController,
    logMongoRepository
  )
  return logControllerDecorator
}
