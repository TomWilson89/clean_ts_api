import { AccountModel } from '@domain/models'
import { AddAccount, AddAccountModel } from '@domain/usecases'
import {
  AddAccountRepository,
  Hasher,
  LoadAccountByEmailRepository
} from '../protocols'

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add(account: AddAccountModel): Promise<AccountModel> {
    const existingAccount = await this.loadAccountByEmailRepository.loadByEmail(
      account.email
    )
    if (existingAccount) {
      return null
    }

    const hashedPassword = await this.hasher.hash(account.password)
    const newAccount = await this.addAccountRepository.add({
      ...account,
      password: hashedPassword
    })
    return await Promise.resolve(newAccount)
  }
}
