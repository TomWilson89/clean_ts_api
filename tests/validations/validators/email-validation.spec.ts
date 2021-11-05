import { EmailValidationAdapter } from '@/infra/validations'
import { EmailValidator } from '@/validations/protocots'

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

    const isValid = await sut.isValid('invalid_email@mail.com')
    expect(isValid).toBe(false)
  })
})
