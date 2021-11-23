import { SaveSurveyResultModel } from '@domain/usecases'

export interface SaveSurveyResultRepository {
  save: (surveyResult: SaveSurveyResultModel) => Promise<void>
}
