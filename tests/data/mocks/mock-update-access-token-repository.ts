import { UpdateAccessTokenRepository } from '../../../src/data/protocols'

export class UpdateAccessTokenRepositoryStub
  implements UpdateAccessTokenRepository
{
  async update(id: string, token: string): Promise<void> {}
}
