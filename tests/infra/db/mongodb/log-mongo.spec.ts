import { LogErrorRepository } from '@data/protocols'
import { LogMongoRepository, MongoHelper } from '@infra/db'
import faker from 'faker'
import { Collection } from 'mongodb'

type SutTypes = {
  sut: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const sut = new LogMongoRepository()

  return {
    sut
  }
}

describe('Log Mongo Repository', () => {
  let errorColletion: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL!)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorColletion = await MongoHelper.getCollection('errors')
    await errorColletion.deleteMany({})
  })
  test('should create an error log on success', async () => {
    const { sut } = makeSut()
    await sut.logError(faker.random.word())
    const count = await errorColletion.countDocuments()
    expect(count).toBe(1)
  })
})
