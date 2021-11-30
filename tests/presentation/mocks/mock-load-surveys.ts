import { mockSurveyModels } from '@/tests/domain/mocks'
import { SurveyModel } from '@domain/models'
import { LoadSurveys } from '@domain/usecases'

export class LoadSurveysSpy implements LoadSurveys {
  result = mockSurveyModels()
  async load(): Promise<SurveyModel[]> {
    return this.result
  }
}
