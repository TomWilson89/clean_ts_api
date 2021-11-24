import { mockAccountModel } from '@/tests/domain/mocks'
import { AddAccountRepository } from '@data/protocols'
import { AccountModel } from '@domain/models'
import { AddAccountParams } from '@domain/usecases'

export class AddAccountRepositoryStub implements AddAccountRepository {
  async add(account: AddAccountParams): Promise<AccountModel> {
    return await new Promise((resolve) => resolve(mockAccountModel()))
  }
}
