import { UpdateAccessTokenRepository } from '@data/protocols'

export class UpdateAccessTokenRepositorySpy
  implements UpdateAccessTokenRepository
{
  id: string
  token: string
  async updateAccessToken(id: string, token: string): Promise<void> {
    this.id = id
    this.token = token
  }
}
