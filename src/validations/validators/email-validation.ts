import { InvalidParamError } from '@presentation/errors'
import { Validation } from '@presentation/protocols'
import { EmailValidator } from '../protocots'

export class EmailValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate(input: any): Error {
    const iValid = this.emailValidator.isValid(input[this.fieldName])

    if (!iValid) {
      return new InvalidParamError(this.fieldName)
    }

    return null
  }
}
