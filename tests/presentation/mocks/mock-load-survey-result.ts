import { mockSurveyResultModel } from '@/tests/domain/mocks'
import { SurveyResultModel } from '@domain/models'
import { LoadSurveyResult } from '@domain/usecases'

export class LoadSurveyResultSpy implements LoadSurveyResult {
  surveyId: string
  accountId: string
  result = mockSurveyResultModel()
  async load(surveyId: string, accountId: string): Promise<SurveyResultModel> {
    this.surveyId = surveyId
    this.accountId = accountId
    return this.result
  }
}
