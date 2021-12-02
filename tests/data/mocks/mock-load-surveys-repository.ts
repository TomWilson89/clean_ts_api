import { mockSurveyModels } from '@/tests/domain/mocks'
import { LoadSurveysRepository } from '@data/protocols'
import { SurveyModel } from '@domain/models'
export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  result = mockSurveyModels()
  accountId: string
  async loadAll(accountId: string): Promise<SurveyModel[]> {
    this.accountId = accountId
    return this.result
  }
}
