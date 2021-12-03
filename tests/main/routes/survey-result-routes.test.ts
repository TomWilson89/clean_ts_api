import { MongoHelper } from '@infra/db'
import { setupApp } from '@main/config/app'
import env from '@main/config/env'
import { Express } from 'express'
import jwt from 'jsonwebtoken'
import { Collection } from 'mongodb'
import request from 'supertest'

let surveysColletion: Collection
let accountCollection: Collection
let app: Express

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

describe('Survey routes', () => {
  beforeAll(async () => {
    app = await setupApp()
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

  describe('PUT /surveys/:surveyId/results', () => {
    test('should return 403 on save survey result without access token', async () => {
      const res = await request(app).put('/api/surveys/any_id/results').send({
        answer: 'any_answer'
      })

      expect(res.status).toBe(403)
    })

    test('should return 200 on save survey result with valid access token', async () => {
      const insertedSurvey = await surveysColletion.insertOne({
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
      })

      const accessToken = await makeAccessToken()
      const res = await request(app)
        .put(`/api/surveys/${insertedSurvey.insertedId.toHexString()}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'Answer 1'
        })

      expect(res.status).toBe(200)
    })
  })

  describe('GET /surveys/:surveyId/results', () => {
    test('should return 403 on load survey result without access token', async () => {
      const res = await request(app).get('/api/surveys/any_id/results')

      expect(res.status).toBe(403)
    })

    test('should return 200 on load survey result with valid access token', async () => {
      const insertedSurvey = await surveysColletion.insertOne({
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
      })

      const accessToken = await makeAccessToken()
      const res = await request(app)
        .get(`/api/surveys/${insertedSurvey.insertedId.toHexString()}/results`)
        .set('x-access-token', accessToken)

      expect(res.status).toBe(200)
    })
  })
})
