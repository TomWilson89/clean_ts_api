import { mockSurveyModel } from '@/tests/domain/mocks'
import { LoadSurveyByIdRepository } from '@data/protocols'
import { SurveyModel } from '@domain/models'

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  id: string
  result = mockSurveyModel()
  async loadById(id: string): Promise<SurveyModel> {
    this.id = id
    return this.result
  }
}
