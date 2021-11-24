import {
  AddSurveyRepository,
  LoadSurveyByIdRepository,
  LoadSurveysRepository
} from '@data//protocols/db/surveys'
import { AddSurveyParams } from '@domain/usecases'
import { MongoHelper, SurveyMongoRepository } from '@infra/db'
import { Collection } from 'mongodb'

const makeFakeSurvey = (): AddSurveyParams => {
  return {
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      }
    ],
    date: new Date()
  }
}
const makeFakeSurveys = (): AddSurveyParams[] => {
  return [
    {
      question: 'any_question',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer'
        }
      ],
      date: new Date()
    },
    {
      question: 'other_question',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer'
        }
      ],
      date: new Date()
    }
  ]
}

let surveyCollection: Collection

type SutTypes = {
  sut: AddSurveyRepository & LoadSurveysRepository & LoadSurveyByIdRepository
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
  describe('add()', () => {
    test('should return a survey to database on success', async () => {
      const { sut } = makeSutTypes()
      const survey = makeFakeSurvey()
      await sut.add(survey)
      const count = await surveyCollection.countDocuments()
      expect(count).toBe(1)
    })
  })

  describe('loadAll()', () => {
    test('should load all surveys on success', async () => {
      const { sut } = makeSutTypes()
      await surveyCollection.insertMany(makeFakeSurveys())
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[1].question).toBe('other_question')
    })

    test('should load empyt list', async () => {
      const { sut } = makeSutTypes()
      const surveys = await sut.loadAll()
      expect(Array.isArray(surveys)).toBe(true)
      expect(surveys.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    test('should load survey by id on success', async () => {
      const { sut } = makeSutTypes()
      const survey = makeFakeSurvey()
      const res = await surveyCollection.insertOne(survey)
      const surveyFound = await sut.loadById(res.insertedId.toHexString())
      expect(surveyFound).toBeTruthy()
      expect(surveyFound.id).toBeTruthy()
    })
  })
})
