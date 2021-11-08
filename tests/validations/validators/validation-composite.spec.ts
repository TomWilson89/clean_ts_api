import { MissingParamError } from '../../../src/presentation/errors'
import { Validation } from '../../../src/presentation/protocols'
import { ValidationComposite } from '../../../src/validations/validators'
import { ValidationStub } from '../../presentation/mocks'

interface SutTypes {
  sut: Validation
  validationStub: Validation
}
const makeSut = (): SutTypes => {
  const validationStub = new ValidationStub()

  const sut = new ValidationComposite([validationStub])

  return {
    sut,
    validationStub
  }
}

describe('ValidationComposite', () => {
  test('should an error if any validation fails', () => {
    const { sut, validationStub } = makeSut()
    const error = new MissingParamError('field')
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(error)
    const errorResponse = sut.validate({ field: 'any_value' })
    expect(errorResponse).toEqual(error)
  })
})
