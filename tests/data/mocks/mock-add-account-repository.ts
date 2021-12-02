import { AddAccountRepository } from '@data/protocols'

export class AddAccountRepositorySpy implements AddAccountRepository {
  accountParams: AddAccountRepository.Params
  isValid = true
  async add(
    accountParams: AddAccountRepository.Params
  ): Promise<AddAccountRepository.Result> {
    this.accountParams = accountParams
    return this.isValid
  }
}
