import { InvalidParamError } from '@presentation/errors'
import { Validation } from '@presentation/protocols'
import { CompareFieldValidation } from '@validations/validators'
import faker from 'faker'

const field = faker.random.word()
const fieldToCompare = faker.random.word()

type SutTypes = {
  sut: Validation
}
const makeSut = (): SutTypes => {
  const sut = new CompareFieldValidation(field, fieldToCompare)
  return {
    sut
  }
}

describe('CompareField Validation', () => {
  test('should return InvalidParamError if validation fails', () => {
    const { sut } = makeSut()
    const error = sut.validate({
      [field]: faker.random.word(),
      [fieldToCompare]: faker.random.words()
    })
    expect(error).toEqual(new InvalidParamError(fieldToCompare))
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
