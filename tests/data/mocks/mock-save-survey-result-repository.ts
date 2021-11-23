import { SaveSurveyResultRepository } from '@data/protocols'
import { SaveSurveyResultModel } from '@domain/usecases'

export class SaveSurveyResultRepositoryStub
  implements SaveSurveyResultRepository
{
  params: SaveSurveyResultModel
  async save(surveyResult: SaveSurveyResultModel): Promise<void> {
    this.params = surveyResult
  }
}
