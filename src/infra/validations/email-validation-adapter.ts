import { EmailValidator } from '@/validations/protocots'

export class EmailValidationAdapter implements EmailValidator {
  async isValid(email: string): Promise<boolean> {
    return false
  }
}
