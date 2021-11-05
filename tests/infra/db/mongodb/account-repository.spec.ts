import { AddAccountRepository } from '@/data/protocols'
import { AccountMongoRepository, MongoHelper } from '@/infra'

interface SutTpes {
  sut: AddAccountRepository
}

const makeSut = (): SutTpes => {
  const sut = new AccountMongoRepository()

  return {
    sut
  }
}

describe('Account Mongo Repositorty', () => {
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

  test('should return a valid id on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    expect(account).toBeTruthy()
  })
})
