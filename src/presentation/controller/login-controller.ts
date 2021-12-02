import { Authentication } from '@domain/usecases'
import { ServerError } from '../errors'
import {
  badRequest,
  serverError,
  successResponse,
  unauthorized
} from '../helpers'
import { Controller, HttpResponse, Validation } from '../protocols'

export class LoginController implements Controller {
  constructor(
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) {}

  public async handle(request: LoginController.Request): Promise<HttpResponse> {
    try {
      const { email, password } = request
      const error = this.validation.validate(request)
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

export namespace LoginController {
  export type Request = {
    email: string
    password: string
  }
}
