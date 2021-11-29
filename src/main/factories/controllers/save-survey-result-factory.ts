import { SaveSurveyResultController } from '@presentation/controller'
import { Controller } from '@presentation/protocols'
import { makeLogControllerDecorator } from '../decorators'
import { makeDbLoadSurveyById, makeDbSaveSurveyResult } from '../usecase'

export const makeSaveSurveyResultController = (): Controller => {
  const surveyResultController = new SaveSurveyResultController(
    makeDbLoadSurveyById(),
    makeDbSaveSurveyResult()
  )
  const logMongoRepository = makeLogControllerDecorator(surveyResultController)
  return logMongoRepository
}
