import { EmailValidatorStub } from '@/tests/presentation/mocks'
import { makeSignUpValidation } from '@main/factories'
import { Validation } from '@presentation/protocols'
import {
  CompareFieldValidation,
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '@validations/validators'

jest.mock('@validations/validators/validation-composite')

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

    validations.push(new EmailValidation('email', new EmailValidatorStub()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
