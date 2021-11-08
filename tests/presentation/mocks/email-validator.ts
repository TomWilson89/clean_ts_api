import { EmailValidator } from '../../../src/validations/protocots'

export class EmailValidatorStub implements EmailValidator {
  isValid(email: string): boolean {
    return true
  }
}
