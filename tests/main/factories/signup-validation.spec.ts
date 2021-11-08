import { makeSignUpValidation } from '../../../src/main/factories'
import { Validation } from '../../../src/presentation/protocols'
import {
  CompareFieldValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '../../../src/validations/validators'

jest.mock('../../../src/validations/validators/validation-composite')

describe('SignUp Validation Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(
      new CompareFieldValidation('password', 'passwordConfirmation')
    )
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
