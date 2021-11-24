import { AddSurvey, AddSurveyParams } from '@domain/usecases'

export class AddSurveyStub implements AddSurvey {
  async add(data: AddSurveyParams): Promise<void> {
    return null
  }
}
