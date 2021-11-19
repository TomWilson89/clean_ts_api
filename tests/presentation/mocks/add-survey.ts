import { AddSurvey, AddSurveyModel } from '../../domain/usecases'

export class AddSurveyStub implements AddSurvey {
  async add(data: AddSurveyModel): Promise<void> {
    return null
  }
}
