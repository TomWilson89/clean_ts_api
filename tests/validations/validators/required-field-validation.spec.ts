import { MissingParamError } from '@presentation/errors'
import { Validation } from '@presentation/protocols'
import { RequiredFieldValidation } from '@validations/validators'

interface SutTypes {
  sut: Validation
}
const makeSut = (): SutTypes => {
  const sut = new RequiredFieldValidation('field')
  return {
    sut
  }
}

describe('RequiredField Validation', () => {
  test('should return MissingParamError if validation fails', () => {
    const { sut } = makeSut()
    const error = sut.validate({ other_field: 'any_field' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('should not return if validation success', () => {
    const { sut } = makeSut()
    const error = sut.validate({ field: 'any_field' })
    expect(error).toBeFalsy()
  })
})
