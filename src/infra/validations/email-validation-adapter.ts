import { EmailValidator } from '@validations/protocots'
import validator from 'validator'

export class EmailValidationAdapter implements EmailValidator {
  isValid(email: string): boolean {
    return validator.isEmail(email)
  }
}
