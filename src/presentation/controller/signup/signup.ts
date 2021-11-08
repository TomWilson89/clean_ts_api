import { AddAccount } from '../../../domain/usecases'
import { EmailValidator } from '../../../validations/protocots'
import { InvalidParamError } from '../../errors'
import { badRequest, serverError, successResponse } from '../../helpers'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation
} from '../../protocols'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount
  private readonly validation: Validation

  constructor(
    emailValidator: EmailValidator,
    addAccount: AddAccount,
    validation: Validation
  ) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
    this.validation = validation
  }

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      const { password, email, passwordConfirmation, name } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const iValid = await this.emailValidator.isValid(email)

      if (!iValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = await this.addAccount.add({ email, name, password })

      return successResponse(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
