import { LoginController } from '@presentation/controller'
import { MissingParamError } from '@presentation/errors'
import {
  badRequest,
  serverError,
  successResponse,
  unauthorized
} from '@presentation/helpers'
import { Controller, HttpRequest } from '@presentation/protocols'
import faker from 'faker'
import { AuthenticationSpy, ValidationSpy } from './mocks'

const mockRequest = (): HttpRequest => {
  return {
    body: {
      email: faker.internet.email(),
      password: faker.internet.password()
    }
  }
}

type SutTypes = {
  sut: Controller
  authenticationSpy: AuthenticationSpy
  validationSpy: ValidationSpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const authenticationSpy = new AuthenticationSpy()
  const sut = new LoginController(authenticationSpy, validationSpy)

  return {
    sut,
    authenticationSpy,
    validationSpy
  }
}

describe('Login Controller', () => {
  test('should call Authenticacion with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()

    const httpRequest = mockRequest()

    await sut.handle(httpRequest)
    expect(authenticationSpy.params).toEqual({
      email: httpRequest.body.email,
      password: httpRequest.body.password
    })
  })

  test('should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut()

    authenticationSpy.result = null

    const httpRequest = mockRequest()

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unauthorized())
  })

  test('should return 500 if Authenticacion throws', async () => {
    const { sut, authenticationSpy } = makeSut()
    jest.spyOn(authenticationSpy, 'auth').mockRejectedValueOnce(new Error())
    const httpRequest = mockRequest()

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 200 if valid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut()
    const httpRequest = mockRequest()

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(successResponse(authenticationSpy.result))
  })

  test('should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut()
    const httpRequest = mockRequest()

    await sut.handle(httpRequest)
    expect(validationSpy.input).toEqual(httpRequest.body)
  })

  test('should return 400 if Validation returns an error', async () => {
    const { sut, validationSpy } = makeSut()
    const error = new MissingParamError(faker.random.word())
    jest.spyOn(validationSpy, 'validate').mockReturnValueOnce(error)
    const httpRequest = mockRequest()

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(error))
  })
})
