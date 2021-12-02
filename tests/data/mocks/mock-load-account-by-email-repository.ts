import { LoadAccountByEmailRepository } from '@data/protocols'
import faker from 'faker'
export class LoadAccountByEmailRepositorySpy
  implements LoadAccountByEmailRepository
{
  email: string
  result = {
    id: faker.datatype.uuid(),
    name: faker.name.findName(),
    password: faker.internet.password()
  }

  async loadByEmail(
    email: string
  ): Promise<LoadAccountByEmailRepository.Result> {
    this.email = email
    return this.result
  }
}
