import { AddSurveyRepository } from '@data/protocols/'

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  surveyData: AddSurveyRepository.Params
  async add(surveyData: AddSurveyRepository.Params): Promise<void> {
    this.surveyData = surveyData
    return null
  }
}
