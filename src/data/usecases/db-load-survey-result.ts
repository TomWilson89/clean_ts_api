import {
  LoadSurveyByIdRepository,
  LoadSurveyResultRepository
} from '@data/protocols'
import { SurveyModel, SurveyResultModel } from '@domain/models'
import { LoadSurveyResult } from '@domain/usecases'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  async load(surveyId: string): Promise<SurveyResultModel> {
    let surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(
      surveyId
    )

    if (!surveyResult) {
      const survey = await this.loadSurveyByIdRepository.loadById(surveyId)
      surveyResult = this.makeEmptyResult(survey)
    }
    return surveyResult
  }

  private makeEmptyResult(survey: SurveyModel): SurveyResultModel {
    return {
      surveyId: survey.id,
      question: survey.question,
      date: survey.date,
      answers: survey.answers.map((answer) => ({
        answer: answer.answer,
        count: 0,
        percent: 0
      }))
    }
  }
}
