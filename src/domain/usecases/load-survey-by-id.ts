import { SurveyModel } from '../models'

export interface LoadSurveysById {
  loadById: () => Promise<SurveyModel>
}
