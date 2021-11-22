import { DbAddSurvey } from '@data/usecases'
import { AddSurvey } from '@domain/usecases'
import { SurveyMongoRepository } from '@infra/db'

export const makeDbAddSurvey = (): AddSurvey => {
  const surveyRepository = new SurveyMongoRepository()
  const dbSurvey = new DbAddSurvey(surveyRepository)

  return dbSurvey
}
