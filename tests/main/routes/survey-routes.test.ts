import jwt from 'jsonwebtoken'
import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../../src/infra'
import app from '../../../src/main/config/app'
import env from '../../../src/main/config/env'

let surveysColletion: Collection
let accountCollection: Collection

const fakeSurvey = {
  question: 'Question',
  answers: [
    {
      image: 'image',
      answer: 'Answer 1'
    },
    {
      answer: 'Answer 2'
    }
  ]
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
      const res = await request(app).post('/api/surveys').send(fakeSurvey)

      expect(res.status).toBe(403)
    })

    test('should return 204 on add survey with valid token', async () => {
      const newUser = await accountCollection.insertOne({
        name: 'Rodrigo',
        email: 'test@test.com',
        password: '123456',
        role: 'admin'
      })

      const id = newUser.insertedId

      const accessToken = await jwt.sign({ id }, env.jwtSecret)
      await accountCollection.updateOne({ _id: id }, { $set: { accessToken } })

      const res = await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send(fakeSurvey)

      expect(res.status).toBe(204)
    })
  })
})
