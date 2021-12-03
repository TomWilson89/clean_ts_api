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

describe('SurveyResult GraphQL', () => {
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

  describe('SaveSurveyResult Mutation', () => {
    test('should return 403 on save survey result without access token', async () => {
      const now = new Date()
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
        date: now
      })

      const query = ` mutation {
        saveSurveyResult(surveyId: "${insertedSurvey.insertedId.toHexString()}", answer: "Answer 1") {
          question
          answers {
            answer
            count
            percent
            isCurrentAccountAnswer
          }
          date
        }
      }
      `

      const res = await request(app).post('/graphql').send({ query })

      expect(res.status).toBe(403)
      expect(res.body.data).toBeFalsy()
      expect(res.body.errors[0].message).toBe('AccessDeniedError')
    })

    test('should return 200 on save survey result with valid access token', async () => {
      const now = new Date()
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
        date: now
      })

      const query = ` mutation {
        saveSurveyResult(surveyId: "${insertedSurvey.insertedId.toHexString()}", answer: "Answer 1") {
          question
          answers {
            answer
            count
            percent
            isCurrentAccountAnswer
          }
          date
        }
      }
      `

      const accessToken = await makeAccessToken()
      const res = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query })

      expect(res.status).toBe(200)
      expect(res.body.data.saveSurveyResult.question).toBe('Question 1')
      expect(res.body.data.saveSurveyResult.date).toBe(now.toISOString())
      expect(res.body.data.saveSurveyResult.answers).toEqual([
        {
          answer: 'Answer 1',
          count: 1,
          percent: 100,
          isCurrentAccountAnswer: true
        },
        {
          answer: 'Answer 2',
          count: 0,
          percent: 0,
          isCurrentAccountAnswer: false
        }
      ])
    })
  })

  describe('SurveyResult Query', () => {
    test('should return AccessDeniedError if no token is provided', async () => {
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

      const query = ` query {
        surveyResult(surveyId: "${insertedSurvey.insertedId.toHexString()}") {
          question
          answers {
            answer
            count
            percent
            isCurrentAccountAnswer
          }
          date
        }
      }
      `
      const res = await request(app).post('/graphql').send({ query })

      expect(res.status).toBe(403)
      expect(res.body.data).toBeFalsy()
      expect(res.body.errors[0].message).toBe('AccessDeniedError')
    })

    test('should return 200 on load survey result with valid access token', async () => {
      const now = new Date()
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
        date: now
      })

      const query = ` query {
        surveyResult(surveyId: "${insertedSurvey.insertedId.toHexString()}") {
          question
          answers {
            answer
            count
            percent
            isCurrentAccountAnswer
          }
          date
        }
      }
      `
      const accessToken = await makeAccessToken()
      const res = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query })

      expect(res.status).toBe(200)
      expect(res.body.data.surveyResult.question).toBe('Question 1')
      expect(res.body.data.surveyResult.date).toBe(now.toISOString())
      expect(res.body.data.surveyResult.answers).toEqual([
        {
          answer: 'Answer 1',
          count: 0,
          percent: 0,
          isCurrentAccountAnswer: false
        },
        {
          answer: 'Answer 2',
          count: 0,
          percent: 0,
          isCurrentAccountAnswer: false
        }
      ])
    })
  })
})
