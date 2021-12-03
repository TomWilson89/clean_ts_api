import { SurveyResultModel } from '../models'

export interface SaveSurveyResult {
  save: (data: SaveSurveyResult.Params) => Promise<SaveSurveyResult.Result>
}

export namespace SaveSurveyResult {
  export type Result = SurveyResultModel

  export type Params = {
    surveyId: string
    accountId: string
    answer: string
    date: Date
  }
}
