import { EmailValidator } from '@/validations/protocots'

export class EmailValidatorStub implements EmailValidator {
  async isValid(email: string): Promise<boolean> {
    return true
  }
}
