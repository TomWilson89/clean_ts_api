import { SurveyResultModel } from '@domain/models'
import { SaveSurveyResultParams } from '@domain/usecases'

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'any_survey_id',
  question: 'any_question',
  answers: [
    {
      answer: 'any_answer',
      count: 0,
      percent: 0
    },
    {
      answer: 'other_answer',
      count: 0,
      percent: 0
    },
    {
      answer: 'current_account_answer',
      count: 0,
      percent: 0
    }
  ],
  date: new Date()
})

export const mockSurveyResultParams = (): SaveSurveyResultParams => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date()
})
