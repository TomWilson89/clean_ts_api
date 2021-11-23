import {
  AddSurveyRepository,
  LoadSurveyByIdRepository,
  LoadSurveysRepository
} from '@data/protocols/'
import { SurveyModel } from '@domain/models'
import { AddSurveyModel } from '@domain/usecases'
import { ObjectId } from 'mongodb'
import { MongoHelper } from '.'

type SurveyRepositoryTypes = AddSurveyRepository &
  LoadSurveysRepository &
  LoadSurveyByIdRepository
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

  async loadById(id: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const survey = (await surveyCollection.findOne({
      _id: new ObjectId(id)
    })) as SurveyModel

    return survey && MongoHelper.map(survey)
  }
}
