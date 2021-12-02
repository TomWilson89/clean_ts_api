import {
  AddSurveyRepository,
  CheckSurveyByIdRepository,
  LoadSurveyByIdRepository,
  LoadSurveysRepository
} from '@data/protocols/'
import { SurveyModel } from '@domain/models'
import { ObjectId } from 'mongodb'
import { MongoHelper, QueryBuilder } from '.'

type SurveyRepositoryTypes = AddSurveyRepository &
  LoadSurveysRepository &
  LoadSurveyByIdRepository &
  CheckSurveyByIdRepository
export class SurveyMongoRepository implements SurveyRepositoryTypes {
  async add(data: AddSurveyRepository.Params): Promise<void> {
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

  async loadById(id: string): Promise<LoadSurveyByIdRepository.Result> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const survey = await surveyCollection.findOne({
      _id: new ObjectId(id)
    })

    return survey && MongoHelper.map(survey)
  }

  async checkById(id: string): Promise<CheckSurveyByIdRepository.Result> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const survey = await surveyCollection.findOne(
      {
        _id: new ObjectId(id)
      },
      {
        projection: {
          _id: 1
        }
      }
    )

    return survey !== null
  }
}
