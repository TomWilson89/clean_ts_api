import { CheckSurveyByIdRepository } from '@data/protocols'
import { CheckSurveysById } from '@domain/usecases'

export class DbCheckSurveyById implements CheckSurveysById {
  constructor(
    private readonly checkSurveyByIdRepository: CheckSurveyByIdRepository
  ) {}

  async checkById(id: string): Promise<CheckSurveyByIdRepository.Result> {
    return await this.checkSurveyByIdRepository.checkById(id)
  }
}
