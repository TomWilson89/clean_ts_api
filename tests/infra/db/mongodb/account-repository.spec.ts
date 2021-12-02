import { mockAddAccountParams } from '@/tests/domain/mocks'
import { AccountMongoRepository, MongoHelper } from '@infra/db'
import faker from 'faker'
import { Collection } from 'mongodb'

const makeFakeUserWithToken = (accessToken = faker.datatype.uuid()): any => ({
  ...mockAddAccountParams(),
  accessToken
})

interface SutTpes {
  sut: AccountMongoRepository
}

const makeSut = (): SutTpes => {
  const sut = new AccountMongoRepository()

  return {
    sut
  }
}

let accountColletion: Collection

describe('Account Mongo Repositorty', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountColletion = await MongoHelper.getCollection('accounts')
    await accountColletion.deleteMany({})
  })

  describe('add', () => {
    test('should return a valid id on success', async () => {
      const { sut } = makeSut()
      const account = await sut.add(mockAddAccountParams())

      expect(account).toBeTruthy()
    })
  })

  describe('loadByEmail', () => {
    test('should return an account on success', async () => {
      const { sut } = makeSut()
      const user = mockAddAccountParams()
      await accountColletion.insertOne(user)

      const account = await sut.loadByEmail(user.email)

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(user.name)
      expect(account.email).toBe(user.email)
      expect(account.password).toBe(user.password)
    })

    test('should return null if loadByEmail fails', async () => {
      const { sut } = makeSut()

      const account = await sut.loadByEmail('any_mail@mail.com')

      expect(account).toBeFalsy()
    })
  })

  describe('updateAccessToken', () => {
    test('should update account accessToken on updateAccessToken success', async () => {
      const { sut } = makeSut()
      const user = mockAddAccountParams()
      const res = await accountColletion.insertOne(user)
      const fakeAccount = await accountColletion.findOne({
        _id: res.insertedId
      })
      expect(fakeAccount).toBeTruthy()
      expect(fakeAccount?.accessToken).toBeFalsy()
      const token = faker.datatype.uuid()

      await sut.updateAccessToken(fakeAccount._id.toHexString(), token)
      const account = await accountColletion.findOne({ _id: res.insertedId })

      expect(account).toBeTruthy()
      expect(account.accessToken).toBe(token)
    })
  })

  describe('loadByToken', () => {
    test('should return an account on success without role', async () => {
      const { sut } = makeSut()
      const user = makeFakeUserWithToken()
      await accountColletion.insertOne(user)

      const account = await sut.loadByToken(user.accessToken)

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(user.name)
      expect(account.email).toBe(user.email)
      expect(account.password).toBe(user.password)
    })

    test('should return an account on success with admin role', async () => {
      const { sut } = makeSut()
      const user = makeFakeUserWithToken()
      const role = 'admin'
      user.role = role
      await accountColletion.insertOne({ ...user, role })

      const account = await sut.loadByToken(user.accessToken, 'admin')

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(user.name)
      expect(account.email).toBe(user.email)
      expect(account.password).toBe(user.password)
    })

    test('should return null with invalid role', async () => {
      const { sut } = makeSut()
      const user = makeFakeUserWithToken()
      await accountColletion.insertOne(user)

      const account = await sut.loadByToken(user.accessToken, 'admin')

      expect(account).toBeFalsy()
    })

    test('should return an account on success with id user is admin', async () => {
      const { sut } = makeSut()
      const user = makeFakeUserWithToken()
      const role = 'admin'
      user.role = role
      await accountColletion.insertOne({ ...user, role })

      const account = await sut.loadByToken(user.accessToken)

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(user.name)
      expect(account.email).toBe(user.email)
      expect(account.password).toBe(user.password)
    })

    test('should return null if loadByToken fails', async () => {
      const { sut } = makeSut()

      const account = await sut.loadByToken(faker.datatype.uuid())

      expect(account).toBeFalsy()
    })
  })
})
