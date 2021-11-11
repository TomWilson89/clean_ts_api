import { SignUpController } from '../../../presentation/controller'
import { Controller } from '../../../presentation/protocols'
import { makeLogControllerDecorator } from '../decorators'
import { makeAuthentication, makeDbAddAccount } from '../usecase'
import { makeSignUpValidation } from './signup-validation-factory'

export const makeSignUpController = (): Controller => {
  const signupController = new SignUpController(
    makeDbAddAccount(),
    makeSignUpValidation(),
    makeAuthentication()
  )
  const logMongoRepository = makeLogControllerDecorator(signupController)

  return logMongoRepository
}
