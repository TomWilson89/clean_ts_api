import { SaveSurveyResultRepository } from '@data/protocols'
import { SurveyResultModel } from '@domain/models'
import { SaveSurveyResult, SaveSurveyResultModel } from '@domain/usecases'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository
  ) {}

  async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.save(data)
    return null
  }
}
