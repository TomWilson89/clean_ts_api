import { AddSurvey } from '@domain/usecases'

export class AddSurveySpy implements AddSurvey {
  params: AddSurvey.Params
  result = null
  async add(params: AddSurvey.Params): Promise<void> {
    this.params = params
    return this.result
  }
}
