import { LoadSurveys } from '../../domain/usecases'
import { serverError, successResponse } from '../helpers'
import { Controller, HttpRequest, HttpResponse } from '../protocols'

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: LoadSurveys) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load()

      return successResponse(surveys)
    } catch (error) {
      return serverError(error)
    }
  }
}
