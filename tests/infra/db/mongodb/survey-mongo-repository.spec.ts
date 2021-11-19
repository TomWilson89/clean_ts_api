import { Collection } from 'mongodb'
import { AddSurveyRepository } from '../../../../src/data//protocols/db/surveys'
import { AddSurveyModel } from '../../../../src/domain/usecases'
import { MongoHelper, SurveyMongoRepository } from '../../../../src/infra/db'

const makeFakeSurvey = (): AddSurveyModel => {
  return {
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      }
    ]
  }
}

let surveyCollection: Collection

interface SutTypes {
  sut: AddSurveyRepository
}

const makeSutTypes = (): SutTypes => {
  const sut = new SurveyMongoRepository()

  return {
    sut
  }
}

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  test('should return 204 on add success', async () => {
    const { sut } = makeSutTypes()
    const survey = makeFakeSurvey()
    await sut.add(survey)
    const count = await surveyCollection.countDocuments()
    expect(count).toBe(1)
  })
})
