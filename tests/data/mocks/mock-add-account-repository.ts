import { mockAccountModel } from '@/tests/domain/mocks'
import { AddAccountRepository } from '@data/protocols'
import { AccountModel } from '@domain/models'
import { AddAccountParams } from '@domain/usecases'

export class AddAccountRepositorySpy implements AddAccountRepository {
  accountParams: AddAccountParams
  accountModel = mockAccountModel()
  async add(accountParams: AddAccountParams): Promise<AccountModel> {
    this.accountParams = accountParams
    return this.accountModel
  }
}
