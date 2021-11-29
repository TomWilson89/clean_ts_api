import { LoadSurveysById } from '@domain/usecases'
import { InvalidParamError } from '@presentation/errors'
import { forbidden } from '@presentation/helpers'
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols'

export class LoadSurveyResultController implements Controller {
  constructor(private readonly loadSurveyById: LoadSurveysById) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const survey = await this.loadSurveyById.loadById(
      httpRequest.params.surveyId
    )
    if (!survey) {
      return forbidden(new InvalidParamError('surveyId'))
    }
    return null
  }
}
