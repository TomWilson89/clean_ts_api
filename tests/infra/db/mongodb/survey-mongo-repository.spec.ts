import { mockAddAccountParams, mockAddSurveyParams } from '@/tests/domain/mocks'
import {
  AddSurveyRepository,
  CheckSurveyByIdRepository,
  LoadSurveyByIdRepository,
  LoadSurveysRepository
} from '@data/protocols/db/surveys'
import { MongoHelper, SurveyMongoRepository } from '@infra/db'
import FakeObjectId from 'bson-objectid'
import { Collection, ObjectId } from 'mongodb'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const mockAccountId = async (): Promise<string> => {
  const res = await accountCollection.insertOne(mockAddAccountParams())

  return res.insertedId.toHexString()
}

type SutTypes = {
  sut: AddSurveyRepository &
    LoadSurveysRepository &
    LoadSurveyByIdRepository &
    CheckSurveyByIdRepository
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
    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('add()', () => {
    test('should return a survey to database on success', async () => {
      const { sut } = makeSutTypes()
      const survey = mockAddSurveyParams()
      await sut.add(survey)
      const count = await surveyCollection.countDocuments()
      expect(count).toBe(1)
    })
  })

  describe('loadAll()', () => {
    test('should load all surveys on success', async () => {
      const { sut } = makeSutTypes()
      const accountId = await mockAccountId()

      const addSurveys = [mockAddSurveyParams(), mockAddSurveyParams()]
      const result = await surveyCollection.insertMany(addSurveys)
      const survey = await surveyCollection.findOne({
        _id: result.insertedIds[0]
      })

      await surveyResultCollection.insertOne({
        surveyId: survey._id,
        accountId: new ObjectId(accountId),
        answer: survey.answers[0].answer,
        date: new Date()
      })

      const surveysResult = await sut.loadAll(accountId)

      expect(surveysResult.length).toBe(2)
      expect(surveysResult[0].id).toBeTruthy()
      expect(surveysResult[0].question).toBe(addSurveys[0].question)
      expect(surveysResult[0].didAnswer).toBe(true)
      expect(surveysResult[1].question).toBe(addSurveys[1].question)
      expect(surveysResult[1].didAnswer).toBe(false)
    })

    test('should load empyt list', async () => {
      const { sut } = makeSutTypes()
      const surveys = await sut.loadAll(await mockAccountId())
      expect(Array.isArray(surveys)).toBe(true)
      expect(surveys.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    test('should load survey by id on success', async () => {
      const { sut } = makeSutTypes()
      const survey = mockAddSurveyParams()
      const res = await surveyCollection.insertOne(survey)
      const surveyFound = await sut.loadById(res.insertedId.toHexString())
      expect(surveyFound).toBeTruthy()
      expect(surveyFound.id).toBeTruthy()
    })

    test('should return null if survey does not exists', async () => {
      const { sut } = makeSutTypes()
      const surveyFound = await sut.loadById(new FakeObjectId().toHexString())
      expect(surveyFound).toBeNull()
    })
  })

  describe('checkById()', () => {
    test('should return true if survey exists', async () => {
      const { sut } = makeSutTypes()
      const survey = mockAddSurveyParams()
      const res = await surveyCollection.insertOne(survey)
      const exists = await sut.checkById(res.insertedId.toHexString())
      expect(exists).toBe(true)
    })

    test('should return false if survey does not exists', async () => {
      const { sut } = makeSutTypes()
      const exists = await sut.checkById(new FakeObjectId().toHexString())
      expect(exists).toBe(false)
    })
  })
})
