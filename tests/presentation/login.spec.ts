import { Authentication } from '../../src/domain/usecases'
import { LoginController } from '../../src/presentation/controller'
import {
  InvalidParamError,
  MissingParamError,
  ServerError
} from '../../src/presentation/errors'
import { badRequest, serverError } from '../../src/presentation/helpers'
import { Controller, HttpRequest } from '../../src/presentation/protocols'
import { EmailValidator } from '../../src/validations/protocots'
import { AuthenticationStub, EmailValidatorStub } from './mocks'

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
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = new EmailValidatorStub()
  const authenticationStub = new AuthenticationStub()
  const sut = new LoginController(emailValidatorStub, authenticationStub)

  return {
    sut,
    emailValidatorStub,
    authenticationStub
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

  test('should return 400 if invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest
      .spyOn(emailValidatorStub, 'isValid')
      .mockReturnValueOnce(Promise.resolve(false))
    const httpRequest = makeHttpRequest()
    httpRequest.body.email = 'inavlid_mail'

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockRejectedValueOnce(false)
    const httpRequest = makeHttpRequest()

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError('email')))
  })

  test('should call Authenticacion with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const httpRequest = makeHttpRequest()

    await sut.handle(httpRequest)
    expect(authSpy).toHaveBeenCalledWith(
      httpRequest.body.email,
      httpRequest.body.password
    )
  })
})
