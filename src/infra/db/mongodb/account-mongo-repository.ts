import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository
} from '@data/protocols'
import { AccountModel } from '@domain/models'
import { ObjectId } from 'mongodb'
import { MongoHelper } from './helper'

type AccountMongoRepositoryTypes = AddAccountRepository &
  LoadAccountByEmailRepository &
  UpdateAccessTokenRepository &
  LoadAccountByTokenRepository

export class AccountMongoRepository implements AccountMongoRepositoryTypes {
  async add(
    account: AddAccountRepository.Params
  ): Promise<AddAccountRepository.Result> {
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
      { _id: new ObjectId(id) },
      { $set: { accessToken: token } }
    )
  }

  async loadByToken(
    token: string,
    role?: string
  ): Promise<LoadAccountByTokenRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne(
      {
        accessToken: token,
        $or: [{ role }, { role: 'admin' }]
      },
      {
        projection: {
          _id: 1
        }
      }
    )
    return account && MongoHelper.map(account)
  }
}
