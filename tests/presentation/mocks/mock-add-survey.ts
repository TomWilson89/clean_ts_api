import { AddSurvey, AddSurveyParams } from '@domain/usecases'

export class AddSurveySpy implements AddSurvey {
  params: AddSurveyParams
  result = null
  async add(params: AddSurveyParams): Promise<void> {
    this.params = params
    return this.result
  }
}
