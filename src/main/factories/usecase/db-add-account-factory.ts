import { DbAddAccount } from '../../../data/usecases'
import { AddAccount } from '../../../domain/usecases'
import { AccountMongoRepository, BcryptAdapter } from '../../../infra'

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
