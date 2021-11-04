import { EmailValidator } from '@/presentation/protocols'

export class EmailValidatorStub implements EmailValidator {
  async isValid(email: string): Promise<boolean> {
    return true
  }
}
