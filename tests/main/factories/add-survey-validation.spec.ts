import { makeAddSurveyValidation } from '../../../src/main/factories'
import { Validation } from '../../../src/presentation/protocols'
import {
  RequiredFieldValidation,
  ValidationComposite
} from '../../../src/validations/validators'

jest.mock('../../../src/validations/validators/validation-composite')

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
