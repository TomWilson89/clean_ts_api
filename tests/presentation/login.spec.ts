import { LoginController } from '../../src/presentation/controller/login'
import { MissingParamError } from '../../src/presentation/errors'
import { badRequest } from '../../src/presentation/helpers'
import { Controller, HttpRequest } from '../../src/presentation/protocols'

const makeHttpRequest = (): HttpRequest => {
  return {
    body: {
      email: 'valid_maila@mail.com',
      password: 'valid_password'
    }
  }
}

interface SutTypes {
  sut: Controller
}

const makeSut = (): SutTypes => {
  const sut = new LoginController()

  return {
    sut
  }
}

describe('Login Controller', () => {
  test('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = makeHttpRequest()
    httpRequest.body.email = null

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = makeHttpRequest()
    httpRequest.body.password = null

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })
})
