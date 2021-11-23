import { SaveSurveyResultRepository } from '@data//protocols/db/surveys'
import { AccountModel, SurveyModel } from '@domain/models'
import { MongoHelper, SurveyResultMongoRepository } from '@infra/db'
import { Collection, ObjectId } from 'mongodb'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeFakeSurvey = async (): Promise<SurveyModel> => {
  const newSurvey = {
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      },
      {
        image: 'other_image',
        answer: 'other_answer'
      }
    ],
    date: new Date()
  }

  const res = await surveyCollection.insertOne(newSurvey)
  const survey = (await surveyCollection.findOne({
    _id: res.insertedId
  })) as SurveyModel
  return survey && MongoHelper.map(survey)
}

const makeFakeUser = async (): Promise<AccountModel> => {
  const newUser = {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  }
  const res = await accountCollection.insertOne(newUser)
  const user = (await accountCollection.findOne({
    _id: res.insertedId
  })) as AccountModel

  return user && MongoHelper.map(user)
}

type SutTypes = {
  sut: SaveSurveyResultRepository
}

const makeSutTypes = (): SutTypes => {
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
      const survey = await makeFakeSurvey()
      const account = await makeFakeUser()
      const { sut } = makeSutTypes()

      await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })

      const surveyResult = await surveyResultCollection.findOne({
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id)
      })

      expect(surveyResult).toBeTruthy()
    })
  })
})
