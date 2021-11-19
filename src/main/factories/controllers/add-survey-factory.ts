import { makeAddSurveyValidation } from '.'
import { AddSurveyController } from '../../../presentation/controller'
import { Controller } from '../../../presentation/protocols'
import { makeLogControllerDecorator } from '../decorators'
import { makeDbAddSurvey } from '../usecase'

export const makeAddSurveyController = (): Controller => {
  const addSurveyController = new AddSurveyController(
    makeAddSurveyValidation(),
    makeDbAddSurvey()
  )
  const logMongoRepository = makeLogControllerDecorator(addSurveyController)
  return logMongoRepository
}
