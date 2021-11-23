import { SurveyResultModel } from '../models'

export interface SaveSurveyResult {
  save: (data: SaveSurveyResultModel) => Promise<SurveyResultModel>
}

export type SaveSurveyResultModel = Omit<SurveyResultModel, 'id'>
