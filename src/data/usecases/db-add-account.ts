import { AddAccount } from '@domain/usecases'
import {
  AddAccountRepository,
  CheckAccountByEmailRepository,
  Hasher
} from '../protocols'

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly checkAccountByEmailRepository: CheckAccountByEmailRepository
  ) {}

  async add(account: AddAccount.Params): Promise<AddAccount.Result> {
    let isValid = false
    const exists = await this.checkAccountByEmailRepository.checkByEmail(
      account.email
    )
    if (!exists) {
      const hashedPassword = await this.hasher.hash(account.password)
      isValid = await this.addAccountRepository.add({
        ...account,
        password: hashedPassword
      })
    }

    return isValid
  }
}
