import { DbLoadSurveyResult } from '@data/usecases'
import { SurveyMongoRepository, SurveyResultMongoRepository } from '@infra/db'

export const makeDbLoadSurveyResult = (): DbLoadSurveyResult => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository()
  const surveyMongoRepository = new SurveyMongoRepository()

  const dbLoadResult = new DbLoadSurveyResult(
    surveyResultMongoRepository,
    surveyMongoRepository
  )

  return dbLoadResult
}
