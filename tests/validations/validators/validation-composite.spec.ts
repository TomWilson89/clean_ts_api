import { ValidationStub } from '@/tests/presentation/mocks'
import { MissingParamError } from '@presentation/errors'
import { Validation } from '@presentation/protocols'
import { ValidationComposite } from '@validations/validators'

interface SutTypes {
  sut: Validation
  validationStubs: Validation[]
}
const makeSut = (): SutTypes => {
  const validationStubs = [new ValidationStub(), new ValidationStub()]

  const sut = new ValidationComposite(validationStubs)

  return {
    sut,
    validationStubs
  }
}

describe('ValidationComposite', () => {
  test('should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut()
    const error = new MissingParamError('field')
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(error)
    const errorResponse = sut.validate({ field: 'any_value' })
    expect(errorResponse).toEqual(error)
  })

  test('should return first error if more than one validation fails', () => {
    const { sut, validationStubs } = makeSut()
    const firstError = new MissingParamError('field')
    const secondError = new MissingParamError('otherField')
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(firstError)
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(secondError)
    const errorResponse = sut.validate({ field: 'any_value' })
    expect(errorResponse).toEqual(firstError)
  })

  test('should not return if validation success', () => {
    const { sut } = makeSut()
    const errorResponse = sut.validate({ field: 'any_value' })
    expect(errorResponse).toBeFalsy()
  })
})
