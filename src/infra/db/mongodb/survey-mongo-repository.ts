import { MongoHelper } from '.'
import {
  AddSurveyRepository,
  LoadSurveysRepository
} from '../../../data/protocols/'
import { SurveyModel } from '../../../domain/models'
import { AddSurveyModel } from '../../../domain/usecases'

type SurveyRepositoryTypes = AddSurveyRepository & LoadSurveysRepository
export class SurveyMongoRepository implements SurveyRepositoryTypes {
  async add(data: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(data)
  }

  async loadAll(): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const surveys = (await surveyCollection.find().toArray()) as SurveyModel[]
    return surveys
  }
}
