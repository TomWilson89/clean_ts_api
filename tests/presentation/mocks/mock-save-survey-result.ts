import { mockSurveyResultModel } from '@/tests/domain/mocks'
import { SurveyResultModel } from '@domain/models'
import { SaveSurveyResult, SaveSurveyResultParams } from '@domain/usecases'

export class SaveSurveyResultSpy implements SaveSurveyResult {
  params: SaveSurveyResultParams
  result = mockSurveyResultModel()
  async save(params: SaveSurveyResultParams): Promise<SurveyResultModel> {
    this.params = params
    return this.result
  }
}
