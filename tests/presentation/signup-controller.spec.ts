import { SignUpController } from '@presentation/controller'
import {
  EmailInUseError,
  MissingParamError,
  ServerError
} from '@presentation/errors'
import {
  badRequest,
  forbidden,
  serverError,
  successResponse
} from '@presentation/helpers'
import { HttpRequest } from '@presentation/protocols'
import faker from 'faker'
import { AddAccountSpy, AuthenticationSpy, ValidationSpy } from './mocks'

const mockRequest = (): HttpRequest => {
  const password = faker.internet.password()
  return {
    body: {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password,
      passwordConfirmation: password
    }
  }
}

type SutTypes = {
  sut: SignUpController
  addAccountSpy: AddAccountSpy
  validationSpy: ValidationSpy
  authenticationSpy: AuthenticationSpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const addAccountSpy = new AddAccountSpy()
  const authenticationSpy = new AuthenticationSpy()
  const sut = new SignUpController(
    addAccountSpy,
    validationSpy,
    authenticationSpy
  )

  return {
    sut,
    addAccountSpy,
    validationSpy,
    authenticationSpy
  }
}

describe('SignUp controller', () => {
  describe('Add Account', () => {
    test('should call AddAccount with correct values', async () => {
      const { sut, addAccountSpy } = makeSut()
      const httpRequest = mockRequest()

      await sut.handle(httpRequest)
      expect(addAccountSpy.account).toEqual({
        name: httpRequest.body.name,
        email: httpRequest.body.email,
        password: httpRequest.body.password
      })
    })

    test('should return 500 if AddAccount throws', async () => {
      const { addAccountSpy, sut } = makeSut()
      jest.spyOn(addAccountSpy, 'add').mockRejectedValueOnce(new ServerError())

      const httpRequest = mockRequest()

      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(serverError(new ServerError()))
    })

    test('should return 200 if valid data is provided', async () => {
      const { sut } = makeSut()
      const httpRequest = mockRequest()

      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(200)
    })

    test('should call Validation with correct values', async () => {
      const { sut, validationSpy } = makeSut()
      const validateSpy = jest.spyOn(validationSpy, 'validate')
      const httpRequest = mockRequest()

      await sut.handle(httpRequest)
      expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    test('should return 400 if Validation returns an error', async () => {
      const { sut, validationSpy } = makeSut()
      const error = new MissingParamError('any_field')
      jest.spyOn(validationSpy, 'validate').mockReturnValueOnce(error)
      const httpRequest = mockRequest()

      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(badRequest(error))
    })

    test('should return 403 if add account returns null', async () => {
      const { sut, addAccountSpy } = makeSut()

      addAccountSpy.result = null

      const httpRequest = mockRequest()

      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
    })
  })

  describe('Authentication', () => {
    test('should call Authenticacion with correct values', async () => {
      const { sut, authenticationSpy } = makeSut()
      const httpRequest = mockRequest()

      await sut.handle(httpRequest)
      expect(authenticationSpy.params).toEqual({
        email: httpRequest.body.email,
        password: httpRequest.body.password
      })
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
      expect(httpResponse).toEqual(
        successResponse({ accessToken: authenticationSpy.result })
      )
    })
  })
})
