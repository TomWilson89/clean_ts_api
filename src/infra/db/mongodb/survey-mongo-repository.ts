import {
  AddSurveyRepository,
  LoadSurveyByIdRepository,
  LoadSurveysRepository
} from '@data/protocols/'
import { SurveyModel } from '@domain/models'
import { AddSurveyParams } from '@domain/usecases'
import { ObjectId } from 'mongodb'
import { MongoHelper, QueryBuilder } from '.'

type SurveyRepositoryTypes = AddSurveyRepository &
  LoadSurveysRepository &
  LoadSurveyByIdRepository
export class SurveyMongoRepository implements SurveyRepositoryTypes {
  async add(data: AddSurveyParams): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(data)
  }

  async loadAll(accountId: string): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const query = await new QueryBuilder()
      .lookup({
        from: 'surveyResults',
        localField: '_id',
        foreignField: 'surveyId',
        as: 'result'
      })
      .project({
        _id: 1,
        question: 1,
        date: 1,
        answers: 1,
        didAnswer: {
          $gte: [
            {
              $size: {
                $filter: {
                  input: '$result',
                  as: 'item',
                  cond: {
                    $eq: ['$$item.accountId', new ObjectId(accountId)]
                  }
                }
              }
            },
            1
          ]
        }
      })
      .build()

    const surveys = await surveyCollection.aggregate(query).toArray()
    return surveys && MongoHelper.mapCollection(surveys)
  }

  async loadById(id: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const survey = (await surveyCollection.findOne({
      _id: new ObjectId(id)
    })) as SurveyModel

    return survey && MongoHelper.map(survey)
  }
}
