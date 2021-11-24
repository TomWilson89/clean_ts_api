import { DbSaveSurveyResult } from '@data/usecases'
import { SurveyResultMongoRepository } from '@infra/db'

export const makeDbSaveSurveyResult = (): DbSaveSurveyResult => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository()
  const dbSaveResult = new DbSaveSurveyResult(
    surveyResultMongoRepository,
    surveyResultMongoRepository
  )

  return dbSaveResult
}
