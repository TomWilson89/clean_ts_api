import { mockSurveyResultModel } from '@/tests/domain/mocks'
import { LoadSurveyResultRepository } from '@data/protocols'
import { SurveyResultModel } from '@domain/models'

export class LoadSurveyResultRepositorySpy
  implements LoadSurveyResultRepository
{
  surveyId: string
  accountId: string
  result = mockSurveyResultModel()
  async loadBySurveyId(
    surveyId: string,
    accountId: string
  ): Promise<SurveyResultModel> {
    this.surveyId = surveyId
    this.accountId = accountId
    return this.result
  }
}
