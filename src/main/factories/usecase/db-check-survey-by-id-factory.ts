import { DbCheckSurveyById } from '@data/usecases'
import { CheckSurveysById } from '@domain/usecases'
import { SurveyMongoRepository } from '@infra/db'

export const makeDbCheckSurveyById = (): CheckSurveysById => {
  const surveyMongoRepository = new SurveyMongoRepository()
  const dbLoadSurveyById = new DbCheckSurveyById(surveyMongoRepository)

  return dbLoadSurveyById
}
