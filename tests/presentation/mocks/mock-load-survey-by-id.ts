import { mockSurveyModel } from '@/tests/domain/mocks'
import { SurveyModel } from '@domain/models'
import { LoadSurveysById } from '@domain/usecases'

export class LoadSurveyByIdStub implements LoadSurveysById {
  async loadById(id: string): Promise<SurveyModel> {
    return mockSurveyModel()
  }
}
