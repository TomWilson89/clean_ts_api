import { EmailValidationAdapter } from '@infra/validations'
import { Validation } from '@presentation/protocols'
import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '@validations/validators'

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  const fields = ['email', 'password']
  for (const field of fields) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation('email', new EmailValidationAdapter()))

  const validationComposite = new ValidationComposite(validations)
  return validationComposite
}
