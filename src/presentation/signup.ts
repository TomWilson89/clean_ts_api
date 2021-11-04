import { MissingParamError } from './errors'
import { badRequest } from './helpers/'
import { HttpRequest, HttpResponse } from './protocols/http'

export class SignUpController {
  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

    const response: HttpResponse = {
      body: {},
      statusCode: 200
    }

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(`Missing param: ${field}`))
      }
    }

    return response
  }
}
