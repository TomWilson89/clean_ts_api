import { SurveyModel } from '@domain/models'
import { LoadSurveysById } from '@domain/usecases'

export class LoadSurveyByIdStub implements LoadSurveysById {
  async loadById(id: string): Promise<SurveyModel> {
    return {
      id: 'valid_id',
      question: 'any_question',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer'
        }
      ],
      date: new Date()
    }
  }
}
