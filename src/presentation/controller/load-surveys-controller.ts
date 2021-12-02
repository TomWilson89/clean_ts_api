import { LoadSurveys } from '@domain/usecases'
import { noContent, serverError, successResponse } from '../helpers'
import { Controller, HttpResponse } from '../protocols'

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: LoadSurveys) {}
  async handle(request: LoadSurveysController.Request): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load(request.accountId)

      if (!surveys.length) {
        return noContent()
      }

      return successResponse(surveys)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace LoadSurveysController {
  export type Request = {
    accountId: string
  }
}
