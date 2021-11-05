import { AddAccountRepository } from '@/data/protocols'
import { AddAccountModel } from '@/domain/usecases'
import { MongoHelper } from './helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add(account: AddAccountModel): Promise<any> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(account)

    return result.insertedId !== null
  }
}
