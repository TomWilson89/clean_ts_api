import { LogControllerDecorator } from '@/main/decorators'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

const makeHttpResponse = (): HttpResponse => {
  return {
    statusCode: 200,
    body: {
      name: 'any_name',
      email: 'any_mail@mail.com',
      id: 'any_id'
    }
  }
}
class ControllerStub implements Controller {
  constructor(private readonly httpResponse: HttpResponse) {
    this.httpResponse = httpResponse
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    return this.httpResponse
  }
}

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
}

const makeSut = (httpResponse = makeHttpResponse()): SutTypes => {
  const controllerStub = new ControllerStub(httpResponse)
  const sut = new LogControllerDecorator(controllerStub)

  return {
    sut,
    controllerStub
  }
}

describe('LogController Decorator', () => {
  test('should call handle method from controller', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        name: 'any_name',
        passwordConfirmation: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('should return the same result as controller', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        name: 'any_name',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(makeHttpResponse())
  })
})
