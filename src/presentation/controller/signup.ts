import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest } from '../helpers'
import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse
} from '../protocols'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

    const response: HttpResponse = {
      body: {},
      statusCode: 200
    }

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    const iValid = this.emailValidator.isValid(httpRequest.body.email)

    if (!iValid) {
      return badRequest(new InvalidParamError('email'))
    }

    return response
  }
}
