import { InvalidParamError } from '@presentation/errors'
import { forbidden } from '@presentation/helpers'
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols'
import { LoadSurveyByIdStub } from '../mocks'

export class SaveSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyByIdStub) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { surveyId } = httpRequest.params
    const survey = await this.loadSurveyById.loadById(surveyId)
    if (!survey) {
      return forbidden(new InvalidParamError('surveyId'))
    }
    return null
  }
}
