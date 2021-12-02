import { AddAccount } from '@domain/usecases'

export class AddAccountSpy implements AddAccount {
  account: AddAccount.Params
  result = true
  public async add(account: AddAccount.Params): Promise<AddAccount.Result> {
    this.account = account
    return this.result
  }
}
