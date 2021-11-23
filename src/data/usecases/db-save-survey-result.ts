import {
  LoadSurveyResultRepository,
  SaveSurveyResultRepository
} from '@data/protocols'
import { SurveyResultModel } from '@domain/models'
import { SaveSurveyResult, SaveSurveyResultModel } from '@domain/usecases'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) {}

  async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.save(data)
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(
      data.surveyId,
      data.accountId
    )
    return surveyResult
  }
}
