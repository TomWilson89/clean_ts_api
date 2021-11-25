import { mockSurveyResultModel } from '@/tests/domain/mocks'
import { SurveyResultModel } from '@domain/models'
import { SaveSurveyResult, SaveSurveyResultParams } from '@domain/usecases'

export class SaveSurveyResultStub implements SaveSurveyResult {
  async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    return mockSurveyResultModel()
  }
}
