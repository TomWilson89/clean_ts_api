import { DbAddAccount } from '@data/usecases'
import { AddAccount } from '@domain/usecases'
import { BcryptAdapter } from '@infra/cryptography'
import { AccountMongoRepository } from '@infra/db'

export const makeDbAddAccount = (): AddAccount => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const addAccountRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(
    bcryptAdapter,
    addAccountRepository,
    addAccountRepository
  )

  return dbAddAccount
}
