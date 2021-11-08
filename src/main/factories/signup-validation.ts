import { Validation } from '../../presentation/protocols'
import {
  CompareFieldValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '../../validations/validators'

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  const fields = ['name', 'email', 'password', 'passwordConfirmation']
  for (const field of fields) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(
    new CompareFieldValidation('password', 'passwordConfirmation')
  )
  const validationComposite = new ValidationComposite(validations)
  return validationComposite
}
