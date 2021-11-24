import { SaveSurveyResultRepository } from '@data/protocols'
import { SaveSurveyResultParams } from '@domain/usecases'

export class SaveSurveyResultRepositoryStub
  implements SaveSurveyResultRepository
{
  params: SaveSurveyResultParams
  async save(surveyResult: SaveSurveyResultParams): Promise<void> {
    this.params = surveyResult
  }
}
