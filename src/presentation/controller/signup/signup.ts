import { AddAccount } from '../../../domain/usecases'
import { badRequest, serverError, successResponse } from '../../helpers'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation
} from '../../protocols'

export class SignUpController implements Controller {
  private readonly addAccount: AddAccount
  private readonly validation: Validation

  constructor(addAccount: AddAccount, validation: Validation) {
    this.addAccount = addAccount
    this.validation = validation
  }

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      const { password, email, name } = httpRequest.body

      const account = await this.addAccount.add({ email, name, password })

      return successResponse(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
