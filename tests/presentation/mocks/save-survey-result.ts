import { SurveyResultModel } from '@domain/models'
import { SaveSurveyResult, SaveSurveyResultParams } from '@domain/usecases'

export class SaveSurveyResultStub implements SaveSurveyResult {
  async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    return {
      id: 'valid_id',
      surveyId: 'valid_survey_id',
      accountId: 'valid_account_id',
      answer: 'valid_answer',
      date: new Date()
    }
  }
}
