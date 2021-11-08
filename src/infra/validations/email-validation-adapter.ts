import validator from 'validator'
import { EmailValidator } from '../../validations/protocots'

export class EmailValidationAdapter implements EmailValidator {
  isValid(email: string): boolean {
    return validator.isEmail(email)
  }
}
