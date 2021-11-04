import { AccountModel } from '../models'

export interface AddAccount {
  add: (account: AddAccountMoodel) => Promise<AccountModel>
}

export interface AddAccountMoodel {
  name: string
  email: string
  password: string
}
