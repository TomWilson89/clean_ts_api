import { LogMongoRepository } from '@infra/db'
import { LogControllerDecorator } from '@main/decorators'
import { Controller } from '@presentation/protocols'

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
