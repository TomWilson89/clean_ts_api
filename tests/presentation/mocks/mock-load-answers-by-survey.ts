import { LoadAnswersBySurvey } from '@domain/usecases'
import faker from 'faker'

export class LoadSurveyAnswersBySurveySpy implements LoadAnswersBySurvey {
  surveyId: string
  result = [faker.random.word(), faker.random.word()]

  async loadAnswers(surveyId: string): Promise<LoadAnswersBySurvey.Result> {
    this.surveyId = surveyId
    return this.result
  }
}
