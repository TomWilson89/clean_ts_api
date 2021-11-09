import {
  AddAccountRepository,
  LoadAccountByEmailRepository
} from '../../../data/protocols'
import { AccountModel } from '../../../domain/models'
import { AddAccountModel } from '../../../domain/usecases'
import { MongoHelper } from './helper'

export class AccountMongoRepository
  implements AddAccountRepository, LoadAccountByEmailRepository
{
  async add(account: AddAccountModel): Promise<any> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(account)

    return result.insertedId !== null
  }

  async loadByEmail(email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })
    return account && MongoHelper.map(account)
  }
}
