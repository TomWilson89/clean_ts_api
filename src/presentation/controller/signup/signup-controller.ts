import { AddAccount, Authentication } from '../../../domain/usecases'
import { badRequest, serverError, successResponse } from '../../helpers'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation
} from '../../protocols'

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      const { password, email, name } = httpRequest.body

      const account = await this.addAccount.add({ email, name, password })
      await this.authentication.auth({
        email,
        password
      })

      return successResponse(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
