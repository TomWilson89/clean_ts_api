import validator from 'validator'
import { EmailValidationAdapter } from '../../../src/infra'
import { EmailValidator } from '../../../src/validations/protocots'

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true
  }
}))

interface SutTypes {
  sut: EmailValidator
}

const makeSut = (): SutTypes => {
  const sut = new EmailValidationAdapter()

  return {
    sut
  }
}

describe('EmailValidatorAdapter', () => {
  test('should return false if validator returns false', async () => {
    const { sut } = makeSut()

    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = await sut.isValid('invalid_email@mail.com')
    expect(isValid).toBe(false)
  })

  test('should return true if validator returns true', async () => {
    const { sut } = makeSut()

    const isValid = await sut.isValid('valid_email@mail.com')
    expect(isValid).toBe(true)
  })

  test('should call Validator with correct email', async () => {
    const { sut } = makeSut()

    const email = 'valid_email@mail.com'
    const isValidSpy = jest.spyOn(validator, 'isEmail')
    await sut.isValid(email)
    expect(isValidSpy).toHaveBeenCalledWith(email)
  })
})
