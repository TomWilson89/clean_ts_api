import { mockSurveyResultModel } from '@/tests/domain/mocks'
import { LoadSurveyResultRepository } from '@data/protocols'
import { SurveyResultModel } from '@domain/models'

export class LoadSurveyResultRepositorySpy
  implements LoadSurveyResultRepository
{
  surveyId: string
  result = mockSurveyResultModel()
  async loadBySurveyId(surveyId: string): Promise<SurveyResultModel> {
    this.surveyId = surveyId
    return this.result
  }
}
