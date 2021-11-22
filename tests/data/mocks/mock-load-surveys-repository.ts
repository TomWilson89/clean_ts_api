import { LoadSurveysRepository } from '../../../src/data/protocols'
import { SurveyModel } from '../../../src/domain/models'
export class LoadSurveysRepositoryStub implements LoadSurveysRepository {
  async loadAll(): Promise<SurveyModel[]> {
    const fakeSurveys = [
      {
        id: 'valid_id',
        question: 'valid_question',
        answers: [
          {
            image: 'valid_image',
            answer: 'valid_answer'
          }
        ],
        date: new Date()
      }
    ]
    return fakeSurveys
  }
}
