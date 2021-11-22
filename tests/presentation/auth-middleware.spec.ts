import { LoadAccountByToken } from '@domain/usecases'
import { AccessDeniedError } from '@presentation/errors'
import { forbidden, serverError, successResponse } from '@presentation/helpers'
import { AuthMiddleware } from '@presentation/middlewares'
import { HttpRequest, Middleware } from '@presentation/protocols'
import { LoadAccountByTokenStub } from './mocks'

const makeHttpRequest = (): HttpRequest => {
  return {
    headers: {
      'x-access-token': 'any_token'
    }
  }
}

interface SutTypes {
  sut: Middleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = new LoadAccountByTokenStub()
  const sut = new AuthMiddleware(loadAccountByTokenStub, role)

  return {
    sut,
    loadAccountByTokenStub
  }
}
describe('Auth Middleware', () => {
  test('should return 403 if no x-access-token is provided in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('should call LoadAccountByToken with correct accessToken', async () => {
    const role = 'any_role'
    const { sut, loadAccountByTokenStub } = makeSut(role)
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    const httpRequest = makeHttpRequest()
    await sut.handle(httpRequest)
    expect(loadSpy).toHaveBeenCalledWith(
      httpRequest.headers['x-access-token'],
      role
    )
  })

  test('should return 403 if LoadAccountByToken return null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest
      .spyOn(loadAccountByTokenStub, 'load')
      .mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(successResponse({ accountId: 'valid_id' }))
  })

  test('should return 50 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest
      .spyOn(loadAccountByTokenStub, 'load')
      .mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
