import { AddAccount, AddAccountMoodel } from '@/domain/usecases'
import { Encrypter } from '../protocols'

export class DbAddAccount implements AddAccount {
  constructor(private readonly encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async add(account: AddAccountMoodel): Promise<any> {
    await this.encrypter.encrypt(account.password)
    return await Promise.resolve(null)
  }
}
