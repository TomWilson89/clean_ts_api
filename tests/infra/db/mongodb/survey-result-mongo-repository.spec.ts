import { mockAddAccountParams, mockAddSurveyParams } from '@/tests/domain/mocks'
import {
  LoadSurveyResultRepository,
  SaveSurveyResultRepository
} from '@data//protocols/db/surveys'
import { SurveyModel } from '@domain/models'
import { MongoHelper, SurveyResultMongoRepository } from '@infra/db'
import { Collection, ObjectId } from 'mongodb'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const mockSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne(mockAddSurveyParams())
  const survey = (await surveyCollection.findOne({
    _id: res.insertedId
  })) as SurveyModel
  return survey && MongoHelper.map(survey)
}

const mockAccountId = async (): Promise<string> => {
  const res = await accountCollection.insertOne(mockAddAccountParams())

  return res.insertedId.toHexString()
}

type SutTypes = {
  sut: SaveSurveyResultRepository & LoadSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const sut = new SurveyResultMongoRepository()

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
    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  describe('save()', () => {
    test('should add survey result if its new', async () => {
      const survey = await mockSurvey()
      const accountId = await mockAccountId()
      const { sut } = makeSut()

      await sut.save({
        surveyId: survey.id,
        accountId,
        answer: survey.answers[0].answer,
        date: new Date()
      })

      const surveyResult = await surveyResultCollection.findOne({
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(accountId)
      })

      expect(surveyResult).toBeTruthy()
    })

    test('should update survey result if its not new', async () => {
      const survey = await mockSurvey()
      const accountId = await mockAccountId()
      const { sut } = makeSut()

      const res = await surveyResultCollection.insertOne({
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(accountId),
        answer: survey.answers[0].answer,
        date: new Date()
      })

      await sut.save({
        surveyId: survey.id,
        accountId,
        answer: survey.answers[1].answer,
        date: new Date()
      })

      const surveyResult = await surveyResultCollection.findOne({
        _id: res.insertedId
      })

      expect(surveyResult).toBeTruthy()
      expect(surveyResult._id).toEqual(res.insertedId)
      expect(surveyResult?.answer).toBe(survey.answers[1].answer)
    })
  })

  describe('loadBySurveyId', () => {
    test('should load survey result', async () => {
      const survey = await mockSurvey()
      const accountId = await mockAccountId()
      const accountId2 = await mockAccountId()
      await surveyResultCollection.insertMany([
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId2),
          answer: survey.answers[0].answer,
          date: new Date()
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId),
          answer: survey.answers[0].answer,
          date: new Date()
        }
      ])
      const { sut } = makeSut()
      const surveyResult = await sut.loadBySurveyId(survey.id)
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(survey.id)
      expect(surveyResult.answers[0].count).toBe(2)
      expect(surveyResult.answers[0].percent).toBe(100)
      expect(surveyResult.answers[1].count).toBe(0)
      expect(surveyResult.answers[1].percent).toBe(0)
      expect(surveyResult.answers.length).toBe(survey.answers.length)
    })
  })

  test('should return null if loadBySurveyId return null', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.loadBySurveyId('any_id')

    expect(surveyResult).toBeFalsy()
  })
})
