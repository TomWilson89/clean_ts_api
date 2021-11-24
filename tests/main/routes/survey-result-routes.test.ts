import { MongoHelper } from '@infra/db'
import app from '@main/config/app'
import request from 'supertest'

describe('Survey routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {})

  describe('PUT /surveys/:surveyId/result', () => {
    test('should return 403 on save survey result without access token', async () => {
      const res = await request(app).put('/api/surveys/any_id/result').send({
        answer: 'any_answer'
      })

      expect(res.status).toBe(403)
    })
  })
})
