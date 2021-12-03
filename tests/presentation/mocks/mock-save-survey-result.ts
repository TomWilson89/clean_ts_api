import { mockSurveyResultModel } from '@/tests/domain/mocks'
import { SurveyResultModel } from '@domain/models'
import { SaveSurveyResult } from '@domain/usecases'

export class SaveSurveyResultSpy implements SaveSurveyResult {
  params: SaveSurveyResult.Params
  result = mockSurveyResultModel()
  async save(params: SaveSurveyResult.Params): Promise<SurveyResultModel> {
    this.params = params
    return this.result
  }
}
