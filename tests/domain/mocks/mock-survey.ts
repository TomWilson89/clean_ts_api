import { SurveyModel } from '@domain/models'
import { AddSurveyParams } from '@domain/usecases'

export const mockAddSurveyParams = (): AddSurveyParams => {
  return {
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      },
      {
        image: 'any_image',
        answer: 'any_answer2'
      }
    ],
    date: new Date()
  }
}

export const mockSurveyModel = (): SurveyModel => {
  return {
    id: 'valid_id',
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      },
      {
        image: 'any_image',
        answer: 'any_answer'
      }
    ],
    date: new Date()
  }
}

export const mockSurveyModels = (): SurveyModel[] => [
  mockSurveyModel(),
  mockSurveyModel()
]
