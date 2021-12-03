import { AddSurvey } from '@domain/usecases'
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

const makeFakeSurveys = (date = new Date()): AddSurvey.Params[] => {
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
      date
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
      date
    }
  ]

  return surveys
}

describe('Survey GraphQl', () => {
  const query = ` query {
    surveys {
      id
      question
      answers {
        image
        answer
      }
      date
      didAnswer
    }
  }
  `
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

  describe('Surveys Query', () => {
    test('should return AccessDenied if no token is provided', async () => {
      const res = await request(app).post('/graphql').send({ query })

      expect(res.status).toBe(403)
      expect(res.body.data).toBeFalsy()
      expect(res.body.errors[0].message).toBe('AccessDeniedError')
    })

    test('should return 200 on load surveys with valid token', async () => {
      const now = new Date()
      const accessToken = await makeAccessToken()

      await surveysColletion.insertMany(makeFakeSurveys(now))

      const res = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query })

      expect(res.status).toBe(200)
      expect(res.body.data.surveys.length).toBe(2)
      expect(res.body.data.surveys[0].id).toBeTruthy()
      expect(res.body.data.surveys[0].question).toBe(
        makeFakeSurveys()[0].question
      )
      expect(res.body.data.surveys[0].date).toBe(now.toISOString())
      expect(res.body.data.surveys[0].didAnswer).toBe(false)
      expect(res.body.data.surveys[0].answers).toEqual([
        {
          answer: makeFakeSurveys()[0].answers[0].answer,
          image: makeFakeSurveys()[0].answers[0].image
        },
        {
          answer: makeFakeSurveys()[0].answers[1].answer,
          image: null
        }
      ])
    })
  })
})
