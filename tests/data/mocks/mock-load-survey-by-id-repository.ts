import { mockSurveyModel } from '@/tests/domain/mocks'
import { LoadSurveyByIdRepository } from '@data/protocols'

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  id: string
  result = mockSurveyModel()
  async loadById(id: string): Promise<LoadSurveyByIdRepository.Result> {
    this.id = id
    return this.result
  }
}
