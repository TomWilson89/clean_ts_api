import {
  LoadSurveyResultRepository,
  SaveSurveyResultRepository
} from '@data/protocols/'
import { SurveyResultModel } from '@domain/models'
import { SaveSurveyResultParams } from '@domain/usecases'
import { ObjectId } from 'mongodb'
import { MongoHelper } from '.'

export class SurveyResultMongoRepository
  implements SaveSurveyResultRepository, LoadSurveyResultRepository
{
  async save(surveyResult: SaveSurveyResultParams): Promise<void> {
    const surveyResultCollection = await MongoHelper.getCollection(
      'surveyResults'
    )
    await surveyResultCollection.findOneAndUpdate(
      {
        surveyId: new ObjectId(surveyResult.surveyId),
        accountId: new ObjectId(surveyResult.accountId)
      },
      {
        $set: {
          answer: surveyResult.answer,
          date: surveyResult.date
        }
      },
      {
        upsert: true
      }
    )
  }

  async loadBySurveyId(
    surveyId: string,
    accountId: string
  ): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection(
      'surveyResults'
    )
    const surveyResult = (await surveyResultCollection.findOne({
      surveyId,
      accountId
    })) as SurveyResultModel

    return surveyResult && MongoHelper.map(surveyResult)
  }

  private async loadBySurveyIdAndAccountId(
    surveyId: string
  ): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection(
      'surveyResults'
    )
    if (!surveyId || !ObjectId.isValid(surveyId)) {
      return null
    }

    const query = surveyResultCollection.aggregate([
      {
        $match: {
          surveyId: new ObjectId(surveyId)
        }
      },
      {
        $group: {
          _id: 0,
          data: {
            $push: '$$ROOT'
          },
          total: {
            $sum: 1
          }
        }
      },
      {
        $unwind: {
          path: '$data'
        }
      },
      {
        $lookup: {
          from: 'surveys',
          localField: 'data.surveyId',
          foreignField: '_id',
          as: 'survey'
        }
      },
      {
        $unwind: {
          path: '$survey'
        }
      },
      {
        $group: {
          _id: {
            surveyId: '$survey._id',
            question: '$survey.question',
            date: '$data.date',
            total: '$total',
            answer: {
              $filter: {
                input: '$survey.answers',
                as: 'item',
                cond: {
                  $eq: ['$$item.answer', '$data.answer']
                }
              }
            }
          },
          count: {
            $sum: 1
          }
        }
      },
      {
        $unwind: {
          path: '$_id.answer'
        }
      },
      {
        $addFields: {
          '_id.answer.count': '$count',
          '_id.answer.percent': {
            $multiply: [
              {
                $divide: ['$count', '$_id.total']
              },
              100
            ]
          }
        }
      },
      {
        $group: {
          _id: {
            surveyId: '$_id.surveyId',
            question: '$_id.question',
            date: '$_id.date'
          },
          answers: {
            $push: '$_id.answer'
          }
        }
      },
      {
        $project: {
          _id: 0,
          surveyId: '$_id.surveyId',
          question: '$_id.question',
          date: '$_id.date',
          answers: '$answers'
        }
      }
    ])

    const surveyResult = await query.toArray()

    return surveyResult?.length ? (surveyResult[0] as SurveyResultModel) : null
  }
}
