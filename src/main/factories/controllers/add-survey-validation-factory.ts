import { Validation } from '@presentation/protocols'
import {
  RequiredFieldValidation,
  ValidationComposite
} from '@validations/validators'

export const makeAddSurveyValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  const fields = ['question', 'answers']
  for (const field of fields) {
    validations.push(new RequiredFieldValidation(field))
  }

  const validationComposite = new ValidationComposite(validations)
  return validationComposite
}
