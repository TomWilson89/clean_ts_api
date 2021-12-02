import { AddAccount } from '@domain/usecases'
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

  async add(account: AddAccount.Params): Promise<AddAccount.Result> {
    let isValid = false
    const existingAccount = await this.loadAccountByEmailRepository.loadByEmail(
      account.email
    )
    if (!existingAccount) {
      const hashedPassword = await this.hasher.hash(account.password)
      isValid = await this.addAccountRepository.add({
        ...account,
        password: hashedPassword
      })
    }

    return isValid
  }
}
