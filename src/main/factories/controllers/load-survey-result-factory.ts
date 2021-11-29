import { LoadSurveyResultController } from '@presentation/controller'
import { Controller } from '@presentation/protocols'
import { makeLogControllerDecorator } from '../decorators'
import { makeDbLoadSurveyById, makeDbLoadSurveyResult } from '../usecase'

export const makeLoadSurveyResultController = (): Controller => {
  const loadSurveyResultController = new LoadSurveyResultController(
    makeDbLoadSurveyById(),
    makeDbLoadSurveyResult()
  )
  const logMongoRepository = makeLogControllerDecorator(
    loadSurveyResultController
  )
  return logMongoRepository
}
