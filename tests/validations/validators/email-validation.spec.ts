import { InvalidParamError } from '@presentation/errors'
import { HttpRequest } from '@presentation/protocols'
import { EmailValidation } from '@validations/validators'
import { EmailValidatorSpy } from '../../presentation/mocks'

const makeRequest = (): HttpRequest => {
  return {
    body: {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
      passwordConfirmation: 'valid_password'
    }
  }
}

type SutTypes = {
  sut: EmailValidation
  emailValidatorSpy: EmailValidatorSpy
}

const makeSut = (): SutTypes => {
  const emailValidatorSpy = new EmailValidatorSpy()
  const sut = new EmailValidation('email', emailValidatorSpy)

  return {
    sut,
    emailValidatorSpy
  }
}

describe('EmailValidation', () => {
  test('should return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorSpy } = makeSut()
    emailValidatorSpy.result = false
    const error = sut.validate(makeRequest())
    expect(error).toEqual(new InvalidParamError('email'))
  })

  test('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    const httpRequest = makeRequest()

    await sut.validate({ email: httpRequest.body.email })
    expect(emailValidatorSpy.email).toBe(httpRequest.body.email)
  })

  test('should throw EmailValidator throws', async () => {
    const { emailValidatorSpy, sut } = makeSut()
    jest.spyOn(emailValidatorSpy, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    expect(sut.validate).toThrow()
  })
})
