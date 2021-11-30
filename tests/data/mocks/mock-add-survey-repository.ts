import { AddSurveyRepository } from '@data/protocols/'
import { AddSurveyParams } from '@domain/usecases'

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  surveyData: AddSurveyParams
  async add(surveyData: AddSurveyParams): Promise<void> {
    this.surveyData = surveyData
    return null
  }
}
