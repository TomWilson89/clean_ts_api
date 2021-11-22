import { AddSurveyRepository } from '@data/protocols/'
import { AddSurveyModel } from '@domain/usecases'

export class AddSurveyRepositoryStub implements AddSurveyRepository {
  async add(surveyData: AddSurveyModel): Promise<void> {
    return null
  }
}
