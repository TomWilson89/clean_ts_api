import { LoadSurveyResult, LoadSurveysById } from '@domain/usecases'
import { InvalidParamError } from '@presentation/errors'
import { forbidden, serverError, successResponse } from '@presentation/helpers'
import { Controller, HttpResponse } from '@presentation/protocols'

export class LoadSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveysById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) {}

  async handle(
    request: LoadSurveyResultController.Request
  ): Promise<HttpResponse> {
    try {
      const { surveyId } = request
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'))
      }

      const surveyResult = await this.loadSurveyResult.load(
        surveyId,
        request.accountId
      )
      return successResponse(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}
export namespace LoadSurveyResultController {
  export type Request = {
    surveyId: string
    accountId: string
  }
}
