import { SurveyAnswersModel } from '../models'

export interface AddSurvey {
  add: (data: AddSurveyModel) => Promise<void>
}

export type AddSurveyModel = {
  question: string
  answers: SurveyAnswersModel[]
  date: Date
}
