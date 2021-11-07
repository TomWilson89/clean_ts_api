import { MongoHelper as sut } from '@/infra'

describe('Mongo Helper', () => {
  beforeAll(async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await sut.connect(process.env.MONGO_URL!)
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  test('should reconnect if monggodb is down', async () => {
    let accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
    await sut.disconnect()
    accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
  })
})
