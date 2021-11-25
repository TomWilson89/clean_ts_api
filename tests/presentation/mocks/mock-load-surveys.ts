import { mockSurveyModels } from '@/tests/domain/mocks'
import { SurveyModel } from '@domain/models'
import { LoadSurveys } from '@domain/usecases'

export class LoadSurveysStub implements LoadSurveys {
  async load(): Promise<SurveyModel[]> {
    return mockSurveyModels()
  }
}
