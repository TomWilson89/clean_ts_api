import { Collection } from 'mongodb'
import { AddAccountModel } from '../../../../src/domain/usecases'
import { AccountMongoRepository, MongoHelper } from '../../../../src/infra'

const makeFakeUser = (): AddAccountModel => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
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
    await MongoHelper.connect(process.env.MONGO_URL!)
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
      const account = await sut.add(makeFakeUser())

      expect(account).toBeTruthy()
    })
  })

  describe('loadByEmail', () => {
    test('should return an account on success', async () => {
      const { sut } = makeSut()
      const user = makeFakeUser()
      await accountColletion.insertOne(user)

      const account = await sut.loadByEmail(user.email)
      console.log('account', account)

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(user.name)
      expect(account.email).toBe(user.email)
      expect(account.password).toBe(user.password)
    })

    test('should return null if loadByEmail fails', async () => {
      const { sut } = makeSut()

      const account = await sut.loadByEmail('any_mail@mail.com')
      console.log('account', account)

      expect(account).toBeFalsy()
    })
  })
})
