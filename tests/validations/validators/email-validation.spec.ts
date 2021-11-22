import { InvalidParamError } from '@presentation/errors'
import { HttpRequest } from '@presentation/protocols'
import { EmailValidator } from '@validations/protocots'
import { EmailValidation } from '@validations/validators'
import { EmailValidatorStub } from '../../presentation/mocks'

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

interface SutTypes {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = new EmailValidatorStub()
  const sut = new EmailValidation('email', emailValidatorStub)

  return {
    sut,
    emailValidatorStub
  }
}

describe('EmailValidation', () => {
  test('should return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const error = sut.validate(makeRequest())
    expect(error).toEqual(new InvalidParamError('email'))
  })

  test('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = makeRequest()

    await sut.validate({ email: httpRequest.body.email })
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
  })

  test('should throw EmailValidator throws', async () => {
    const { emailValidatorStub, sut } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    expect(sut.validate).toThrow()
  })
})
