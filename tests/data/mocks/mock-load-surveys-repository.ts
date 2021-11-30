import { mockSurveyModels } from '@/tests/domain/mocks'
import { LoadSurveysRepository } from '@data/protocols'
import { SurveyModel } from '@domain/models'
export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  result = mockSurveyModels()
  async loadAll(): Promise<SurveyModel[]> {
    return this.result
  }
}
