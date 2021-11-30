import { ValidationSpy } from '@/tests/presentation/mocks'
import { MissingParamError } from '@presentation/errors'
import { Validation } from '@presentation/protocols'
import { ValidationComposite } from '@validations/validators'

type SutTypes = {
  sut: Validation
  validationSpies: Validation[]
}
const makeSut = (): SutTypes => {
  const validationSpies = [new ValidationSpy(), new ValidationSpy()]

  const sut = new ValidationComposite(validationSpies)

  return {
    sut,
    validationSpies
  }
}

describe('ValidationComposite', () => {
  test('should return an error if any validation fails', () => {
    const { sut, validationSpies } = makeSut()
    const error = new MissingParamError('field')
    jest.spyOn(validationSpies[0], 'validate').mockReturnValueOnce(error)
    const errorResponse = sut.validate({ field: 'any_value' })
    expect(errorResponse).toEqual(error)
  })

  test('should return first error if more than one validation fails', () => {
    const { sut, validationSpies } = makeSut()
    const firstError = new MissingParamError('field')
    const secondError = new MissingParamError('otherField')
    jest.spyOn(validationSpies[0], 'validate').mockReturnValueOnce(firstError)
    jest.spyOn(validationSpies[1], 'validate').mockReturnValueOnce(secondError)
    const errorResponse = sut.validate({ field: 'any_value' })
    expect(errorResponse).toEqual(firstError)
  })

  test('should not return if validation success', () => {
    const { sut } = makeSut()
    const errorResponse = sut.validate({ field: 'any_value' })
    expect(errorResponse).toBeFalsy()
  })
})
