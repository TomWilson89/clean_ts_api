import { MongoHelper } from '.'
import { AddSurveyRepository } from '../../../data/protocols/db/surveys'
import { AddSurveyModel } from '../../../domain/usecases'

export class SurveyMongoRepository implements AddSurveyRepository {
  async add(data: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(data)
  }
}
