import { makeLoginValidation } from '../../../src/main/factories'
import { Validation } from '../../../src/presentation/protocols'
import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '../../../src/validations/validators'
import { EmailValidatorStub } from '../../presentation/mocks'

jest.mock('../../../src/validations/validators/validation-composite')

describe('Login Validation Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }

    validations.push(new EmailValidation('email', new EmailValidatorStub()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
