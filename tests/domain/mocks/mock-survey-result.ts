import { SurveyResultModel } from '@domain/models'
import { SaveSurveyResult } from '@domain/usecases'
import faker from 'faker'

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: faker.datatype.uuid(),
  question: faker.random.words(),
  answers: [
    {
      answer: faker.random.words(),
      isCurrentAccountAnswer: faker.datatype.boolean(),
      count: 0,
      percent: 0
    },
    {
      answer: faker.random.words(),
      isCurrentAccountAnswer: faker.datatype.boolean(),
      count: 0,
      percent: 0
    }
  ],
  date: new Date()
})

export const mockSurveyResultParams = (): SaveSurveyResult.Params => ({
  surveyId: faker.datatype.uuid(),
  accountId: faker.datatype.uuid(),
  answer: faker.random.words(),
  date: faker.date.recent()
})
