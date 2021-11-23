import { SurveyModel } from '../models'

export interface AddSurvey {
  add: (data: AddSurveyModel) => Promise<void>
}

export type AddSurveyModel = Omit<SurveyModel, 'id'>
