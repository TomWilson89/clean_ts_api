import { LoginController } from '@presentation/controller'
import { Controller } from '@presentation/protocols'
import { makeLogControllerDecorator } from '../decorators'
import { makeAuthentication } from '../usecase'
import { makeLoginValidation } from './login-validation-factory'

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(
    makeAuthentication(),
    makeLoginValidation()
  )
  const logMongoRepository = makeLogControllerDecorator(loginController)

  return logMongoRepository
}
