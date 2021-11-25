import { mockSurveyResultModel } from '@/tests/domain/mocks'
import { LoadSurveyResultRepository } from '@data/protocols'
import { SurveyResultModel } from '@domain/models'

export class LoadSurveyResultRepositoryStub
  implements LoadSurveyResultRepository
{
  async loadBySurveyId(
    surveyId: string,
    accountId: string
  ): Promise<SurveyResultModel> {
    return mockSurveyResultModel()
  }
}
