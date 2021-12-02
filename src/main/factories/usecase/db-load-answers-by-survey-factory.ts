import { DbLoadAnswersBySurvey } from '@data/usecases'
import { LoadAnswersBySurvey } from '@domain/usecases'
import { SurveyMongoRepository } from '@infra/db'

export const makeDbLoadAnswersBySurvey = (): LoadAnswersBySurvey => {
  const surveyMongoRepository = new SurveyMongoRepository()
  const dbLoadSurveyById = new DbLoadAnswersBySurvey(surveyMongoRepository)

  return dbLoadSurveyById
}
