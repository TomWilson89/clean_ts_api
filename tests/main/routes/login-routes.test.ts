import bcrypt from 'bcrypt'
import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../../src/infra'
import app from '../../../src/main/config/app'

let accountColletion: Collection

const fakeUser = {
  name: 'John Doe',
  email: 'john@mail.com',
  password: '123456'
}

describe('Login routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL!)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountColletion = await MongoHelper.getCollection('accounts')
    await accountColletion.deleteMany({})
  })

  describe('POST /signup', () => {
    test('should return 200 on signup', async () => {
      const newUser = { ...fakeUser, passwordConfirmation: '123456' }
      const res = await request(app).post('/api/signup').send(newUser)

      expect(res.status).toBe(200)
    })
  })

  describe('POST /login', () => {
    test('should return 200 on login', async () => {
      const password = await bcrypt.hash(fakeUser.password, 12)
      await accountColletion.insertOne({ ...fakeUser, password })
      const res = await request(app).post('/api/login').send({
        email: 'john@mail.com',
        password: '123456'
      })

      expect(res.status).toBe(200)
    })

    test('should return 401 on login', async () => {
      const res = await request(app).post('/api/login').send({
        email: 'john@mail.com',
        password: '123456'
      })

      expect(res.status).toBe(401)
    })
  })
})
