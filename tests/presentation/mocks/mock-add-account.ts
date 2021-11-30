import { mockAccountModel } from '@/tests/domain/mocks'
import { AccountModel } from '@domain/models'
import { AddAccount, AddAccountParams } from '@domain/usecases'

export class AddAccountSpy implements AddAccount {
  account: AddAccountParams
  result = mockAccountModel()
  public async add(account: AddAccountParams): Promise<AccountModel> {
    this.account = account
    return this.result
  }
}
