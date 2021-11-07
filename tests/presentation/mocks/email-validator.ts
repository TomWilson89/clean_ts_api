import { EmailValidator } from '../../../src/validations/protocots'

export class EmailValidatorStub implements EmailValidator {
  async isValid(email: string): Promise<boolean> {
    return true
  }
}
