import { MissingParamError } from './errors'
import { badRequest } from './helpers/'
import { HttpRequest, HttpResponse } from './protocols/http'

export class SignUpController {
  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    let response: HttpResponse = {
      body: {},
      statusCode: 200
    }
    if (!httpRequest.body.name) {
      response = badRequest(new MissingParamError('Missing param: name'))
    }
    if (!httpRequest.body.email) {
      response = badRequest(new MissingParamError('Missing param: email'))
    }

    return response
  }
}
