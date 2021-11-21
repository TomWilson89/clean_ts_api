import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository
} from '../../../data/protocols'
import { AccountModel } from '../../../domain/models'
import { AddAccountModel } from '../../../domain/usecases'
import { MongoHelper } from './helper'

type AccountMongoRepositoryTypes = AddAccountRepository &
  LoadAccountByEmailRepository &
  UpdateAccessTokenRepository &
  LoadAccountByTokenRepository

export class AccountMongoRepository implements AccountMongoRepositoryTypes {
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

  async updateAccessToken(id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne(
      { _id: id },
      { $set: { accessToken: token } }
    )
  }

  async loadByToken(token: string, role?: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({
      accessToken: token,
      $or: [{ role }, { role: 'admin' }]
    })
    return account && MongoHelper.map(account)
  }
}
