import { LoadSurveyByIdRepository } from '@data/protocols'
import { SurveyModel } from '@domain/models'

export class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
  async loadById(id: string): Promise<SurveyModel> {
    return null
  }
}
