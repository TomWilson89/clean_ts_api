import { DbLoadSurveyById } from '@data/usecases'
import { LoadSurveysById } from '@domain/usecases'
import { SurveyMongoRepository } from '@infra/db'

export const makeDbLoadSurveyById = (): LoadSurveysById => {
  const surveyMongoRepository = new SurveyMongoRepository()
  const dbLoadSurveyById = new DbLoadSurveyById(surveyMongoRepository)

  return dbLoadSurveyById
}
