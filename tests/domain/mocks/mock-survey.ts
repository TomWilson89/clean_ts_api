import { SurveyModel } from '@domain/models'
import { AddSurvey } from '@domain/usecases'
import faker from 'faker'

export const mockAddSurveyParams = (): AddSurvey.Params => {
  return {
    question: faker.random.words(),
    answers: [
      {
        image: faker.image.imageUrl(),
        answer: faker.random.words()
      },
      {
        image: faker.image.imageUrl(),
        answer: faker.random.words()
      }
    ],
    date: faker.date.recent()
  }
}

export const mockSurveyModel = (): SurveyModel => {
  return {
    id: faker.datatype.uuid(),
    question: faker.random.words(),
    answers: [
      {
        image: faker.image.imageUrl(),
        answer: faker.random.words()
      },
      {
        image: faker.image.imageUrl(),
        answer: faker.random.words()
      }
    ],
    date: faker.date.recent()
  }
}

export const mockSurveyModels = (): SurveyModel[] => [
  mockSurveyModel(),
  mockSurveyModel()
]
