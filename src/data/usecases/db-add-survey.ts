import { AddSurvey, AddSurveyParams } from '@domain/usecases'
import { AddSurveyRepository } from '../protocols/db/surveys'

export class DbAddSurvey implements AddSurvey {
  constructor(private readonly addSurveyRepository: AddSurveyRepository) {}
  async add(data: AddSurveyParams): Promise<void> {
    await this.addSurveyRepository.add(data)
    return null
  }
}
