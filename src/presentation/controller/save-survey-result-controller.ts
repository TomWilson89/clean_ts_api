import { LoadAnswersBySurvey, SaveSurveyResult } from '@domain/usecases'
import { InvalidParamError } from '@presentation/errors'
import { forbidden, serverError, successResponse } from '@presentation/helpers'
import { Controller, HttpResponse } from '@presentation/protocols'

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly loadAnswersBysurvey: LoadAnswersBySurvey,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle(
    request: SaveSurveyResultController.Request
  ): Promise<HttpResponse> {
    try {
      const { surveyId, accountId, answer } = request
      const answers = await this.loadAnswersBysurvey.loadAnswers(surveyId)

      if (!answers.length) {
        return forbidden(new InvalidParamError('surveyId'))
      }

      if (!answers.includes(answer)) {
        return forbidden(new InvalidParamError('answer'))
      }

      const surveyResult = await this.saveSurveyResult.save({
        surveyId,
        accountId,
        answer,
        date: new Date()
      })

      return successResponse(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace SaveSurveyResultController {
  export type Request = {
    surveyId: string
    answer: string
    accountId: string
  }
}
