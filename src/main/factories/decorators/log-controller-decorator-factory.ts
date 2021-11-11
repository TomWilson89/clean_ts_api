import { LogMongoRepository } from '../../../infra'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators'

export const makeLogControllerDecorator = (
  controller: Controller
): Controller => {
  const logMongoRepository = new LogMongoRepository()
  const logControllerDecorator = new LogControllerDecorator(
    controller,
    logMongoRepository
  )

  return logControllerDecorator
}
