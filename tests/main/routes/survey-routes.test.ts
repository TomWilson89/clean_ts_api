import { AddSurveyParams } from '@domain/usecases'
import { MongoHelper } from '@infra/db'
import app from '@main/config/app'
import env from '@main/config/env'
import jwt from 'jsonwebtoken'
import { Collection } from 'mongodb'
import request from 'supertest'

let surveysColletion: Collection
let accountCollection: Collection

const makeAccessToken = async (): Promise<string> => {
  const newUser = await accountCollection.insertOne({
    name: 'Rodrigo',
    email: 'test@test.com',
    password: '123456',
    role: 'admin'
  })

  const id = newUser.insertedId

  const accessToken = await jwt.sign({ id }, env.jwtSecret)
  await accountCollection.updateOne({ _id: id }, { $set: { accessToken } })
  return accessToken
}

const makeFakeSurveys = (): AddSurveyParams[] => {
  const surveys = [
    {
      question: 'Question 1',
      answers: [
        {
          image: 'image 1',
          answer: 'Answer 1'
        },
        {
          answer: 'Answer 2'
        }
      ],
      date: new Date()
    },
    {
      question: 'Question 2',
      answers: [
        {
          image: 'image 2',
          answer: 'Answer 1'
        },
        {
          answer: 'Answer 2'
        }
      ],
      date: new Date()
    }
  ]

  return surveys
}

describe('Survey routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveysColletion = await MongoHelper.getCollection('surveys')
    accountCollection = await MongoHelper.getCollection('accounts')
    await surveysColletion.deleteMany({})
    await accountCollection.deleteMany({})
  })

  describe('POST /surveys', () => {
    test('should return 403 on add survey without access token', async () => {
      const res = await request(app)
        .post('/api/surveys')
        .send(makeFakeSurveys()[0])

      expect(res.status).toBe(403)
    })

    test('should return 204 on add survey with valid token', async () => {
      const accessToken = await makeAccessToken()

      const res = await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send(makeFakeSurveys()[0])

      expect(res.status).toBe(204)
    })
  })
  describe('GET /surveys', () => {
    test('should return 403 on load surveys without access token', async () => {
      const res = await request(app).get('/api/surveys')

      expect(res.status).toBe(403)
    })

    test('should return 200 on load surveys with valid token', async () => {
      const accessToken = await makeAccessToken()

      await surveysColletion.insertMany(makeFakeSurveys())

      const res = await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)

      expect(res.status).toBe(200)
    })
  })
})
