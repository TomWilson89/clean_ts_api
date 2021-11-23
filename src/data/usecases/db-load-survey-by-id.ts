import { LoadSurveyByIdRepository } from '@data/protocols'
import { SurveyModel } from '@domain/models'
import { LoadSurveysById } from '@domain/usecases'

export class DbLoadSurveyById implements LoadSurveysById {
  constructor(
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  async loadById(id: string): Promise<SurveyModel> {
    await this.loadSurveyByIdRepository.loadById(id)
    return null
  }
}
