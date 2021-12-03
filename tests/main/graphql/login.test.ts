import { MongoHelper } from '@infra/db'
import { setupApp } from '@main/config/app'
import bcrypt from 'bcrypt'
import { Express } from 'express'
import { Collection } from 'mongodb'
import request from 'supertest'

let accountColletion: Collection
let app: Express

const fakeUser = {
  name: 'John Doe',
  email: 'john@mail.com',
  password: '123456'
}

describe('Login Graphql', () => {
  beforeAll(async () => {
    app = await setupApp()
    await MongoHelper.connect(process.env.MONGO_URL!)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountColletion = await MongoHelper.getCollection('accounts')
    await accountColletion.deleteMany({})
  })

  describe('SignUp Mutation', () => {
    const query = ` mutation {
      signUp(
        name: "${fakeUser.name}",
        email: "${fakeUser.email}",
        password: "${fakeUser.password}"
        passwordConfirmation: "${fakeUser.password}"
      ){
        accessToken
        name
      }
    }

    `
    test('should return an Account on valid data', async () => {
      const res = await request(app).post('/graphql').send({ query })

      expect(res.status).toBe(200)
      expect(res.body.data.signUp.accessToken).toBeTruthy()
      expect(res.body.data.signUp.name).toBe(fakeUser.name)
    })

    test('should return EmailInUseError on invalid data', async () => {
      const password = await bcrypt.hash(fakeUser.password, 12)
      await accountColletion.insertOne({ ...fakeUser, password })
      const res = await request(app).post('/graphql').send({ query })

      expect(res.status).toBe(403)
      expect(res.body.data).toBeFalsy()
      expect(res.body.errors[0].message).toBe('Email already in use')
    })
  })

  describe('Login Query', () => {
    const query = ` query {
      login(email: "${fakeUser.email}", password: "${fakeUser.password}") {
        accessToken
        name
      }
    }
    `
    test('should return an Account on valid credentials', async () => {
      const password = await bcrypt.hash(fakeUser.password, 12)
      await accountColletion.insertOne({ ...fakeUser, password })
      const res = await request(app).post('/graphql').send({ query })

      expect(res.status).toBe(200)
      expect(res.body.data.login.accessToken).toBeTruthy()
      expect(res.body.data.login.name).toBe(fakeUser.name)
    })

    test('should return UnauthorizedError on invalid credentials', async () => {
      const res = await request(app).post('/graphql').send({ query })

      expect(res.status).toBe(401)
      expect(res.body.data).toBeFalsy()
      expect(res.body.errors[0].message).toBe('Unauthorized')
    })
  })
})
