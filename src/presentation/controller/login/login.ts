import { EmailValidator } from '../../../validations/protocots'
import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

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

    await this.emailValidator.isValid(email)
  }
}
