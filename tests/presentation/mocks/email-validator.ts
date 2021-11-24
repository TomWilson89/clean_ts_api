import { EmailValidator } from '@validations/protocots'

export class EmailValidatorStub implements EmailValidator {
  isValid(email: string): boolean {
    return true
  }
}
