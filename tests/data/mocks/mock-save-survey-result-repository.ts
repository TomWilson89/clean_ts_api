import { SaveSurveyResultRepository } from '@data/protocols'
import { SaveSurveyResult } from '@domain/usecases'

export class SaveSurveyResultRepositorySpy
  implements SaveSurveyResultRepository
{
  params: SaveSurveyResult.Params
  async save(surveyResult: SaveSurveyResult.Params): Promise<void> {
    this.params = surveyResult
  }
}
