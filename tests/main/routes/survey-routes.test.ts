import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../../src/infra'
import app from '../../../src/main/config/app'

let surveysColletion: Collection

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
    await surveysColletion.deleteMany({})
  })

  describe('POST /surveys', () => {
    test('should return 204 on  add survey success', async () => {
      const res = await request(app).post('/api/surveys').send(fakeSurvey)

      expect(res.status).toBe(204)
    })
  })
})
