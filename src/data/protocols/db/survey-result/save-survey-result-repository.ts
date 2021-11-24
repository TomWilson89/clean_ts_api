import { SaveSurveyResultParams } from '@domain/usecases'

export interface SaveSurveyResultRepository {
  save: (surveyResult: SaveSurveyResultParams) => Promise<void>
}
