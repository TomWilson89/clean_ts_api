import { AccountModel } from '@/domain/models'
import { AddAccount, AddAccountMoodel } from '@/domain/usecases'

export class AddAccountStub implements AddAccount {
  public account?: AddAccountMoodel
  public async add(account: AddAccountMoodel): Promise<AccountModel> {
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
