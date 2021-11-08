import { AccountModel } from '../../src/domain/models'
import { AddAccount } from '../../src/domain/usecases'
import { SignUpController } from '../../src/presentation/controller'
import { MissingParamError, ServerError } from '../../src/presentation/errors'
import {
  badRequest,
  serverError,
  successResponse
} from '../../src/presentation/helpers'
import { HttpRequest, Validation } from '../../src/presentation/protocols'
import { AddAccountStub, ValidationStub } from './mocks'

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

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const validationStub = new ValidationStub()
  const addAccountStub = new AddAccountStub()
  const sut = new SignUpController(addAccountStub, validationStub)

  return {
    sut,
    addAccountStub,
    validationStub
  }
}

describe('SignUp controller', () => {
  test('should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = makeRequest()

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

    const httpRequest = makeRequest()

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeRequest()

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(successResponse(makeFakeAccount()))
  })

  test('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeRequest()

    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    const error = new MissingParamError('any_field')
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(error)
    const httpRequest = makeRequest()

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(error))
  })
})
