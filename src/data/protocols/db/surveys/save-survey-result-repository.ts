import { SurveyResultModel } from '@domain/models'
import { SaveSurveyResultModel } from '@domain/usecases'

export interface SaveSurveyResultRepository {
  save: (surveyResult: SaveSurveyResultModel) => Promise<SurveyResultModel>
}
