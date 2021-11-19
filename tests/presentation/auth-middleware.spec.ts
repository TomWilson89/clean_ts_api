import { AccessDeniedError } from '../../src/presentation/errors'
import { forbidden } from '../../src/presentation/helpers'
import { AuthMiddleware } from '../../src/presentation/middlewares'
import { HttpRequest, Middleware } from '../../src/presentation/protocols'

const makeHttpRequest = (): HttpRequest => {
  return {
    headers: {
      'x-access-token': 'any_token'
    }
  }
}

interface SutTypes {
  sut: Middleware
}

const makeSut = (): SutTypes => {
  const sut = new AuthMiddleware()

  return {
    sut
  }
}
describe('Auth Middleware', () => {
  test('should return 403 if no x-access-token is provided in headers', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
})
