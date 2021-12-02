import { LogErrorRepository } from '@data/protocols'
import { LogControllerDecorator } from '@main/decorators'
import { serverError, successResponse } from '@presentation/helpers'
import { Controller, HttpResponse } from '@presentation/protocols'
import faker from 'faker'
import { LogErrorRepositoryStub } from '../../data/mocks'

const makeHttpResponse = (): HttpResponse => {
  return {
    statusCode: 200,
    body: {
      id: faker.datatype.uuid(),
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    }
  }
}

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}
class ControllerStub implements Controller {
  request: any
  httpResponse = successResponse(makeHttpResponse())

  async handle(request: any): Promise<HttpResponse> {
    this.request = request
    return this.httpResponse
  }
}

type SutTypes = {
  sut: LogControllerDecorator
  controllerStub: ControllerStub
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const controllerStub = new ControllerStub()
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
    const request = faker.random.word()

    await sut.handle(request)
    expect(controllerStub.request).toEqual(request)
  })

  test('should return the same result as controller', async () => {
    const { sut, controllerStub } = makeSut()

    const httpResponse = await sut.handle(faker.random.word())
    expect(httpResponse).toEqual(controllerStub.httpResponse)
  })

  test('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(Promise.resolve(makeFakeServerError()))

    await sut.handle(faker.random.word())
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
