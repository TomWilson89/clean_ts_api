import { DbAddAccount } from '@/data/usecases'
import {
  AccountMongoRepository,
  BcryptAdapter,
  EmailValidationAdapter
} from '@/infra'
import { SignUpController } from '@/presentation/controller'

export const makeSignUpController = (): SignUpController => {
  const salt = 12
  const emailValidatorAdapter = new EmailValidationAdapter()
  const bcryptAdapter = new BcryptAdapter(salt)
  const addAccountRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, addAccountRepository)
  const controller = new SignUpController(emailValidatorAdapter, dbAddAccount)
  return controller
}
