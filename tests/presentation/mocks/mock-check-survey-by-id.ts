import { CheckSurveysById } from '@domain/usecases'

export class CheckSurveyByIdSpy implements CheckSurveysById {
  surveyId: string
  result = true
  async checkById(surveyId: string): Promise<CheckSurveysById.Result> {
    this.surveyId = surveyId
    return this.result
  }
}
