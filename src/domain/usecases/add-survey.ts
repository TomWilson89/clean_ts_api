import { SurveyModel } from '../models'

export interface AddSurvey {
  add: (data: AddSurveyParams) => Promise<void>
}

export type AddSurveyParams = Omit<SurveyModel, 'id'>
