import { SurveyResultModel } from '@domain/models'
import { SaveSurveyResultParams } from '@domain/usecases'
import faker from 'faker'

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: faker.datatype.uuid(),
  question: faker.random.words(),
  answers: [
    {
      answer: faker.random.words(),
      count: 0,
      percent: 0
    },
    {
      answer: faker.random.words(),
      count: 0,
      percent: 0
    }
  ],
  date: new Date()
})

export const mockSurveyResultParams = (): SaveSurveyResultParams => ({
  surveyId: faker.datatype.uuid(),
  accountId: faker.datatype.uuid(),
  answer: faker.random.words(),
  date: faker.date.recent()
})
