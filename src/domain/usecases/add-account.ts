import { AccountModel } from '../models'

export interface AddAccount {
  add: (account: AddAccountModel) => Promise<AccountModel>
}

export type AddAccountModel = {
  name: string
  email: string
  password: string
}
