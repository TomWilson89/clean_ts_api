import { InvalidParamError } from '../../../src/presentation/errors'
import { Validation } from '../../../src/presentation/protocols'
import { CompareFieldValidation } from '../../../src/validations/validators'

interface SutTypes {
  sut: Validation
}
const makeSut = (): SutTypes => {
  const sut = new CompareFieldValidation('field', 'fieldToCompare')
  return {
    sut
  }
}

describe('CompareField Validation', () => {
  test('should return InvalidParamError if validation fails', () => {
    const { sut } = makeSut()
    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'wrong_value'
    })
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })

  test('should not return if validation success', () => {
    const { sut } = makeSut()
    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'any_value'
    })
    expect(error).toBeFalsy()
  })
})
