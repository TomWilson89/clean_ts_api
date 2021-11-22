import { AddSurveyRepository } from '../../../src/data/protocols/'
import { AddSurveyModel } from '../../../src/domain/usecases'

export class AddSurveyRepositoryStub implements AddSurveyRepository {
  async add(surveyData: AddSurveyModel): Promise<void> {
    return null
  }
}
