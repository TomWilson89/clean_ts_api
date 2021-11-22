import { makeAddSurveyValidation } from '@main/factories'
import { Validation } from '@presentation/protocols'
import {
  RequiredFieldValidation,
  ValidationComposite
} from '@validations/validators'

jest.mock('@validations/validators/validation-composite')

describe('Add Survey Validation Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation()
    const validations: Validation[] = []
    for (const field of ['question', 'answers']) {
      validations.push(new RequiredFieldValidation(field))
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
