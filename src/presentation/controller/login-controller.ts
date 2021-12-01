import { Authentication } from '@domain/usecases'
import { ServerError } from '../errors'
import {
  badRequest,
  serverError,
  successResponse,
  unauthorized
} from '../helpers'
import { Controller, HttpRequest, HttpResponse, Validation } from '../protocols'

export class LoginController implements Controller {
  constructor(
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) {}

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const authenticationModel = await this.authentication.auth({
        email,
        password
      })
      if (!authenticationModel) {
        return unauthorized()
      }

      return successResponse(authenticationModel)
    } catch (error) {
      return serverError(new ServerError())
    }
  }
}
