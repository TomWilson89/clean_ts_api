import { EmailValidator } from '@/validations/protocots'
import validator from 'validator'

export class EmailValidationAdapter implements EmailValidator {
  async isValid(email: string): Promise<boolean> {
    return validator.isEmail(email)
  }
}
