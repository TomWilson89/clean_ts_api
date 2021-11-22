import { LoadSurveysController } from '../../../presentation/controller'
import { Controller } from '../../../presentation/protocols'
import { makeLogControllerDecorator } from '../decorators'
import { makeDbLoadSurveys } from '../usecase'

export const makeLoadSurveysController = (): Controller => {
  const loadSurveysController = new LoadSurveysController(makeDbLoadSurveys())
  const logMongoRepository = makeLogControllerDecorator(loadSurveysController)
  return logMongoRepository
}
