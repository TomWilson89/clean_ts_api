import { SurveyModel } from '../models'

export interface LoadSurveysById {
  loadById: (id: string) => Promise<SurveyModel>
}
