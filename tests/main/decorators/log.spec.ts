import { LogErrorRepository } from '@data/protocols'
import { LogControllerDecorator } from '@main/decorators'
import { serverError } from '@presentation/helpers'
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols'
import { LogErrorRepositoryStub } from '../../data/mocks'

const makeHttpResponse = (): HttpResponse => {
  return {
    statusCode: 200,
    body: {
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
  }
}

const makeHttpRequest = (): HttpRequest => {
  return {
    body: {
      email: 'any_email@mail.com',
      password: 'any_password',
      name: 'any_name',
      passwordConfirmation: 'any_password'
    }
  }
}

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}
class ControllerStub implements Controller {
  constructor(private readonly httpResponse: HttpResponse) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    return this.httpResponse
  }
}

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (httpResponse = makeHttpResponse()): SutTypes => {
  const controllerStub = new ControllerStub(httpResponse)
  const logErrorRepositoryStub = new LogErrorRepositoryStub()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

describe('LogController Decorator', () => {
  test('should call handle method from controller', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')

    await sut.handle(makeHttpRequest())
    expect(handleSpy).toHaveBeenCalledWith(makeHttpRequest())
  })

  test('should return the same result as controller', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(makeHttpResponse())
  })

  test('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(Promise.resolve(makeFakeServerError()))

    await sut.handle(makeHttpRequest())
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
