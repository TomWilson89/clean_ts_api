import { SurveyResultModel } from '@domain/models'
import { SaveSurveyResultParams } from '@domain/usecases'

export const mockSurveyResultModel = (): SurveyResultModel =>
  Object.assign({}, mockSurveyResultParams(), { id: 'valid_id' })

export const mockSurveyResultParams = (): SaveSurveyResultParams => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date()
})
