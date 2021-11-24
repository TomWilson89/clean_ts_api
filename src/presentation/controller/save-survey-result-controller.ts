import { SaveSurveyResult } from '@domain/usecases'
import { InvalidParamError } from '@presentation/errors'
import { forbidden, serverError } from '@presentation/helpers'
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols'
import { LoadSurveyByIdStub } from '../mocks'

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveyByIdStub,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const survey = await this.loadSurveyById.loadById(surveyId)

      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'))
      }

      const { answer } = httpRequest.body
      const { accountId } = httpRequest
      const answers = survey.answers.map((a) => a.answer)

      if (!answers.includes(answer)) {
        return forbidden(new InvalidParamError('answer'))
      }
      await this.saveSurveyResult.save({
        surveyId,
        accountId,
        answer,
        date: new Date()
      })
      return null
    } catch (error) {
      return serverError(error)
    }
  }
}
