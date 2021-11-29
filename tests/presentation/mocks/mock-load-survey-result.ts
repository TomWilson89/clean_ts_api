import { mockSurveyResultModel } from '@/tests/domain/mocks'
import { SurveyResultModel } from '@domain/models'
import { LoadSurveyResult } from '@domain/usecases'

export class LoadSurveyResultStub implements LoadSurveyResult {
  async load(surveyId: string): Promise<SurveyResultModel> {
    return mockSurveyResultModel()
  }
}
