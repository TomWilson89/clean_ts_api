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
import faker from 'faker'
import { AddAccountSpy, AuthenticationSpy, ValidationSpy } from './mocks'

const mockRequest = (): SignUpController.Request => {
  const password = faker.internet.password()
  return {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password,
    passwordConfirmation: password
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
      const request = mockRequest()

      await sut.handle(request)
      expect(addAccountSpy.account).toEqual({
        name: request.name,
        email: request.email,
        password: request.password
      })
    })

    test('should return 500 if AddAccount throws', async () => {
      const { addAccountSpy, sut } = makeSut()
      jest.spyOn(addAccountSpy, 'add').mockRejectedValueOnce(new ServerError())

      const request = mockRequest()

      const httpResponse = await sut.handle(request)
      expect(httpResponse).toEqual(serverError(new ServerError()))
    })

    test('should return 200 if valid data is provided', async () => {
      const { sut } = makeSut()
      const request = mockRequest()

      const httpResponse = await sut.handle(request)
      expect(httpResponse.statusCode).toBe(200)
    })

    test('should call Validation with correct values', async () => {
      const { sut, validationSpy } = makeSut()
      const validateSpy = jest.spyOn(validationSpy, 'validate')
      const request = mockRequest()

      await sut.handle(request)
      expect(validateSpy).toHaveBeenCalledWith(request)
    })

    test('should return 400 if Validation returns an error', async () => {
      const { sut, validationSpy } = makeSut()
      const error = new MissingParamError('any_field')
      jest.spyOn(validationSpy, 'validate').mockReturnValueOnce(error)
      const request = mockRequest()

      const httpResponse = await sut.handle(request)
      expect(httpResponse).toEqual(badRequest(error))
    })

    test('should return 403 if add account returns null', async () => {
      const { sut, addAccountSpy } = makeSut()

      addAccountSpy.result = null

      const request = mockRequest()

      const httpResponse = await sut.handle(request)
      expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
    })
  })

  describe('Authentication', () => {
    test('should call Authenticacion with correct values', async () => {
      const { sut, authenticationSpy } = makeSut()
      const request = mockRequest()

      await sut.handle(request)
      expect(authenticationSpy.params).toEqual({
        email: request.email,
        password: request.password
      })
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
  })
})
