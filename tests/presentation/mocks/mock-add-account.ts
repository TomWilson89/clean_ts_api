import { mockAccountModel } from '@/tests/domain/mocks'
import { AccountModel } from '@domain/models'
import { AddAccount, AddAccountParams } from '@domain/usecases'

export class AddAccountStub implements AddAccount {
  public account?: AddAccountParams
  public async add(account: AddAccountParams): Promise<AccountModel> {
    this.account = account

    return mockAccountModel()
  }
}
