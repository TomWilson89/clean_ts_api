import { LoadAnswersBySurveyRepository } from '@data/protocols'
import faker from 'faker'

export class LoadAnswersBySurveyRepositorySpy
  implements LoadAnswersBySurveyRepository
{
  id: string
  result = [faker.random.word(), faker.random.word()]

  async loadAnswers(id: string): Promise<LoadAnswersBySurveyRepository.Result> {
    this.id = id
    return this.result
  }
}
