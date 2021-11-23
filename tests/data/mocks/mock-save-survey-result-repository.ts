import { SaveSurveyResultRepository } from '@data/protocols'
import { SurveyResultModel } from '@domain/models'
import { SaveSurveyResultModel } from '@domain/usecases'

export class SaveSurveyResultRepositoryStub
  implements SaveSurveyResultRepository
{
  async save(surveyResult: SaveSurveyResultModel): Promise<SurveyResultModel> {
    return {
      id: 'valid_id',
      surveyId: 'any_survey_id',
      accountId: 'any_account_id',
      answer: 'any_answer',
      date: new Date()
    }
  }
}
