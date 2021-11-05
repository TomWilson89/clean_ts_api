import { MongoHelper } from '@/infra'
import app from '@/main/config/app'
import request from 'supertest'

describe('SignUp routes', () => {
  beforeAll(async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await MongoHelper.connect(process.env.MONGO_URL!)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountColletion = MongoHelper.getCollection('accounts')
    await accountColletion.deleteMany({})
  })

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
