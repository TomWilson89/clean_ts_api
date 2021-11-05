import { AddAccount, AddAccountModel } from '@/domain/usecases'
import { AddAccountRepository, Encrypter } from '../protocols'

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository
  ) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
  }

  async add(account: AddAccountModel): Promise<any> {
    const hashedPassword = await this.encrypter.encrypt(account.password)
    await this.addAccountRepository.add({
      ...account,
      password: hashedPassword
    })
    return await Promise.resolve(null)
  }
}
