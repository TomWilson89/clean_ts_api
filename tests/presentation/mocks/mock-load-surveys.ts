import { mockSurveyModels } from '@/tests/domain/mocks'
import { SurveyModel } from '@domain/models'
import { LoadSurveys } from '@domain/usecases'

export class LoadSurveysSpy implements LoadSurveys {
  accountId: string
  result = mockSurveyModels()
  async load(accountId: string): Promise<SurveyModel[]> {
    this.accountId = accountId

    return this.result
  }
}
