import { mockSurveyModel } from '@/tests/domain/mocks'
import { SurveyModel } from '@domain/models'
import { LoadSurveysById } from '@domain/usecases'

export class LoadSurveyByIdSpy implements LoadSurveysById {
  surveyId: string
  result = mockSurveyModel()
  async loadById(surveyId: string): Promise<SurveyModel> {
    this.surveyId = surveyId
    return this.result
  }
}
