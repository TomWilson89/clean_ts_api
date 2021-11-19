import { AddSurvey } from '../../domain/usecases'
import { badRequest } from '../helpers'
import { Controller, HttpRequest, HttpResponse, Validation } from '../protocols'

export class AddSurveyController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      await this.addSurvey.add(httpRequest.body)
      return null
    } catch (error) {
      return null
    }
  }
}
