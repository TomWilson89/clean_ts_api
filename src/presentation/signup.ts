import { HttpRequest, HttpResponse } from './protocols/http'

export class SignUpController {
  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    let response: HttpResponse = {
      body: {},
      statusCode: 200
    }
    if (!httpRequest.body.name) {
      response = {
        statusCode: 400,
        body: new Error('Missing param: name')
      }
    }
    if (!httpRequest.body.email) {
      response = {
        statusCode: 400,
        body: new Error('Missing param: email')
      }
    }

    return response
  }
}
