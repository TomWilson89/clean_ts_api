import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body
    if (!email) {
      return await Promise.resolve(badRequest(new MissingParamError('email')))
    }

    if (!password) {
      return await Promise.resolve(
        badRequest(new MissingParamError('password'))
      )
    }
  }
}
