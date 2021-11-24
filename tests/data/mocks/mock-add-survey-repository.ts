import { AddSurveyRepository } from '@data/protocols/'
import { AddSurveyParams } from '@domain/usecases'

export class AddSurveyRepositoryStub implements AddSurveyRepository {
  async add(surveyData: AddSurveyParams): Promise<void> {
    return null
  }
}
