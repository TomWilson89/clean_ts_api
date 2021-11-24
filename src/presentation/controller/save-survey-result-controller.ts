import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols'
import { LoadSurveyByIdStub } from '../mocks'

export class SaveSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveyByIdStub) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { surveyId } = httpRequest.params
    await this.loadSurveyById.loadById(surveyId)
    return null
  }
}
