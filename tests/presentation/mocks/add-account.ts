import { AccountModel } from '../../../src/domain/models'
import { AddAccount, AddAccountModel } from '../../../src/domain/usecases'

export class AddAccountStub implements AddAccount {
  public account?: AddAccountModel
  public async add(account: AddAccountModel): Promise<AccountModel> {
    this.account = account

    const fakeAccount = {
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }

    return fakeAccount
  }
}
