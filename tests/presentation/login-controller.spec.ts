import { LoginController } from '@presentation/controller'
import { MissingParamError } from '@presentation/errors'
import {
  badRequest,
  serverError,
  successResponse,
  unauthorized
} from '@presentation/helpers'
import { Controller } from '@presentation/protocols'
import faker from 'faker'
import { AuthenticationSpy, ValidationSpy } from './mocks'

const mockRequest = (): LoginController.Request => {
  return {
    email: faker.internet.email(),
    password: faker.internet.password()
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

    const request = mockRequest()

    await sut.handle(request)
    expect(authenticationSpy.params).toEqual({
      email: request.email,
      password: request.password
    })
  })

  test('should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut()

    authenticationSpy.result = null

    const request = mockRequest()

    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(unauthorized())
  })

  test('should return 500 if Authenticacion throws', async () => {
    const { sut, authenticationSpy } = makeSut()
    jest.spyOn(authenticationSpy, 'auth').mockRejectedValueOnce(new Error())
    const request = mockRequest()

    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 200 if valid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut()
    const request = mockRequest()

    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(successResponse(authenticationSpy.result))
  })

  test('should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut()
    const request = mockRequest()

    await sut.handle(request)
    expect(validationSpy.input).toEqual(request)
  })

  test('should return 400 if Validation returns an error', async () => {
    const { sut, validationSpy } = makeSut()
    const error = new MissingParamError(faker.random.word())
    jest.spyOn(validationSpy, 'validate').mockReturnValueOnce(error)
    const request = mockRequest()

    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(badRequest(error))
  })
})
