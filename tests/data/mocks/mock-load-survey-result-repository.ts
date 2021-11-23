import { LoadSurveyResultRepository } from '@data/protocols'
import { SurveyResultModel } from '@domain/models'

export class LoadSurveyResultRepositoryStub
  implements LoadSurveyResultRepository
{
  async loadBySurveyId(
    surveyId: string,
    accountId: string
  ): Promise<SurveyResultModel> {
    return {
      id: 'valid_id',
      surveyId: 'any_survey_id',
      accountId: 'any_account_id',
      answer: 'any_answer',
      date: new Date()
    }
  }
}
