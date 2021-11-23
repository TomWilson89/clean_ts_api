import { LoadSurveyByIdRepository } from '@data/protocols'
import { SurveyModel } from '@domain/models'

export class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
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
