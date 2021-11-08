import { LoginController } from '../../src/presentation/controller/login'
import { MissingParamError } from '../../src/presentation/errors'
import { badRequest } from '../../src/presentation/helpers'
import { Controller, HttpRequest } from '../../src/presentation/protocols'
import { EmailValidator } from '../../src/validations/protocots'
import { EmailValidatorStub } from './mocks'

const makeHttpRequest = (): HttpRequest => {
  return {
    body: {
      email: 'valid_maila@mail.com',
      password: 'valid_password'
    }
  }
}

interface SutTypes {
  sut: Controller
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = new EmailValidatorStub()
  const sut = new LoginController(emailValidatorStub)

  return {
    sut,
    emailValidatorStub
  }
}

describe('Login Controller', () => {
  test('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = makeHttpRequest()
    httpRequest.body.email = null

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = makeHttpRequest()
    httpRequest.body.password = null

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('should call EmailValidator with correct mail', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = makeHttpRequest()

    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
  })
})
