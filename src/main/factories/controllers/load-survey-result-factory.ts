import { LoadSurveyResultController } from '@presentation/controller'
import { Controller } from '@presentation/protocols'
import { makeLogControllerDecorator } from '../decorators'
import { makeDbCheckSurveyById, makeDbLoadSurveyResult } from '../usecase'

export const makeLoadSurveyResultController = (): Controller => {
  const loadSurveyResultController = new LoadSurveyResultController(
    makeDbCheckSurveyById(),
    makeDbLoadSurveyResult()
  )
  const logMongoRepository = makeLogControllerDecorator(
    loadSurveyResultController
  )
  return logMongoRepository
}
