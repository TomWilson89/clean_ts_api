import { AddAccount, AddAccountModel } from '@/domain/usecases'
import { Encrypter } from '../protocols'

export class DbAddAccount implements AddAccount {
  constructor(private readonly encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async add(account: AddAccountModel): Promise<any> {
    await this.encrypter.encrypt(account.password)
    return await Promise.resolve(null)
  }
}
