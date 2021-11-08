import { AddAccount } from '../../../domain/usecases'
import { EmailValidator } from '../../../validations/protocots'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError, successResponse } from '../../helpers'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount
  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation'
      ]

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
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
