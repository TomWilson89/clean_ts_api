import { TokenGenerator } from '../../../src/data/protocols'

export class TokenGeneratorStub implements TokenGenerator {
  async generate(id: string): Promise<string> {
    return 'valid_token'
  }
}
