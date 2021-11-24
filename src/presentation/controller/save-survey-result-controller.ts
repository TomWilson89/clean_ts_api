import { InvalidParamError } from '@presentation/errors'
import { forbidden, serverError } from '@presentation/helpers'
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols'
import { LoadSurveyByIdStub } from '../mocks'

export class SaveSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyByIdStub) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'))
      }
      return null
    } catch (error) {
      return serverError(error)
    }
  }
}
