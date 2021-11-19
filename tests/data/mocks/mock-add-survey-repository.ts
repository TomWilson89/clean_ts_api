import { AddSurveyRepository } from '../../../src/data/protocols/db/surveys'
import { AddSurveyModel } from '../../../src/domain/usecases'

export class AddSurveyRepositoryStub implements AddSurveyRepository {
  async add(surveyData: AddSurveyModel): Promise<void> {
    return null
  }
}
