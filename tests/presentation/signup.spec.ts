import { AddAccount, Authentication } from '@domain/usecases'
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
import { HttpRequest, Validation } from '@presentation/protocols'
import { AddAccountStub, AuthenticationStub, ValidationStub } from './mocks'

const makeHttpRequest = (): HttpRequest => {
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
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const validationStub = new ValidationStub()
  const addAccountStub = new AddAccountStub()
  const authenticationStub = new AuthenticationStub()
  const sut = new SignUpController(
    addAccountStub,
    validationStub,
    authenticationStub
  )

  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub
  }
}

describe('SignUp controller', () => {
  describe('Add Account', () => {
    test('should call AddAccount with correct values', async () => {
      const { sut, addAccountStub } = makeSut()
      const addSpy = jest.spyOn(addAccountStub, 'add')
      const httpRequest = makeHttpRequest()

      await sut.handle(httpRequest)
      expect(addSpy).toHaveBeenCalledWith({
        name: httpRequest.body.name,
        email: httpRequest.body.email,
        password: httpRequest.body.password
      })
    })

    test('should return 500 if AddAccount throws', async () => {
      const { addAccountStub, sut } = makeSut()
      jest.spyOn(addAccountStub, 'add').mockRejectedValueOnce(new ServerError())

      const httpRequest = makeHttpRequest()

      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(serverError(new ServerError()))
    })

    test('should return 200 if valid data is provided', async () => {
      const { sut } = makeSut()
      const httpRequest = makeHttpRequest()

      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(200)
    })

    test('should call Validation with correct values', async () => {
      const { sut, validationStub } = makeSut()
      const validateSpy = jest.spyOn(validationStub, 'validate')
      const httpRequest = makeHttpRequest()

      await sut.handle(httpRequest)
      expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    test('should return 400 if Validation returns an error', async () => {
      const { sut, validationStub } = makeSut()
      const error = new MissingParamError('any_field')
      jest.spyOn(validationStub, 'validate').mockReturnValueOnce(error)
      const httpRequest = makeHttpRequest()

      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(badRequest(error))
    })

    test('should return 403 if add account returns null', async () => {
      const { sut, addAccountStub } = makeSut()
      jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(null)
      const httpRequest = makeHttpRequest()

      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
    })
  })

  describe('Authentication', () => {
    test('should call Authenticacion with correct values', async () => {
      const { sut, authenticationStub } = makeSut()
      const authSpy = jest.spyOn(authenticationStub, 'auth')
      const httpRequest = makeHttpRequest()

      await sut.handle(httpRequest)
      expect(authSpy).toHaveBeenCalledWith({
        email: httpRequest.body.email,
        password: httpRequest.body.password
      })
    })

    test('should return 500 if Authenticacion throws', async () => {
      const { sut, authenticationStub } = makeSut()
      jest.spyOn(authenticationStub, 'auth').mockRejectedValueOnce(new Error())
      const httpRequest = makeHttpRequest()

      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(serverError(new Error()))
    })

    test('should return 200 if valid credentials are provided', async () => {
      const { sut } = makeSut()
      const httpRequest = makeHttpRequest()

      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(
        successResponse({ accessToken: 'any_token' })
      )
    })
  })
})
