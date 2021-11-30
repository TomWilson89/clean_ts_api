import { mockSurveyResultModel } from '@/tests/domain/mocks'
import { SurveyResultModel } from '@domain/models'
import { LoadSurveyResult } from '@domain/usecases'

export class LoadSurveyResultSpy implements LoadSurveyResult {
  surveyId: string
  result = mockSurveyResultModel()
  async load(surveyId: string): Promise<SurveyResultModel> {
    this.surveyId = surveyId
    return this.result
  }
}
