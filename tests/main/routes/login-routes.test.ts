import request from 'supertest'
import { MongoHelper } from '../../../src/infra'
import app from '../../../src/main/config/app'

describe('Login routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL!)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountColletion = await MongoHelper.getCollection('accounts')
    await accountColletion.deleteMany({})
  })

  describe('POST /signup', () => {
    test('should return 200 on signup', async () => {
      const res = await request(app).post('/api/signup').send({
        name: 'John Doe',
        email: 'john@mail.com',
        password: '123456',
        passwordConfirmation: '123456'
      })

      expect(res.status).toBe(200)
    })
  })

  describe('POST /login', () => {
    test('should return an account on success', async () => {
      const res = await request(app).post('/api/signup').send({
        name: 'John Doe',
        email: 'john@mail.com',
        password: '123456',
        passwordConfirmation: '123456'
      })

      expect(res.status).toBe(200)
    })
  })
})
