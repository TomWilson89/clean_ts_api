import { AddAccountRepository } from '@/data/protocols/db'
import { AccountModel } from '@/domain/models'
import { AddAccountModel } from '@/domain/usecases'

export class AddAccountRepositoryStub implements AddAccountRepository {
  async add(account: AddAccountModel): Promise<AccountModel> {
    const fakeAccount = {
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    }

    return await new Promise((resolve) => resolve(fakeAccount))
  }
}
