import { mockSurveyModels } from '@/tests/domain/mocks'
import { LoadSurveysRepository } from '@data/protocols'
import { SurveyModel } from '@domain/models'
export class LoadSurveysRepositoryStub implements LoadSurveysRepository {
  async loadAll(): Promise<SurveyModel[]> {
    return mockSurveyModels()
  }
}
