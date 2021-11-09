import { AccountModel } from '../../domain/models'
import { AddAccount, AddAccountModel } from '../../domain/usecases'
import { AddAccountRepository, Hasher } from '../protocols'

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) {
    this.hasher = hasher
    this.addAccountRepository = addAccountRepository
  }

  async add(account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(account.password)
    const newAccount = await this.addAccountRepository.add({
      ...account,
      password: hashedPassword
    })
    return await Promise.resolve(newAccount)
  }
}
