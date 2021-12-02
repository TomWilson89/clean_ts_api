import { CheckSurveyByIdRepository } from '@data/protocols'

export class CheckSurveyByIdRepositorySpy implements CheckSurveyByIdRepository {
  id: string
  result = true
  async checkById(id: string): Promise<CheckSurveyByIdRepository.Result> {
    this.id = id
    return this.result
  }
}
