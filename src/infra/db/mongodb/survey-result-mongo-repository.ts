import {
  LoadSurveyResultRepository,
  SaveSurveyResultRepository
} from '@data/protocols/'
import { SurveyResultModel } from '@domain/models'
import { SaveSurveyResultParams } from '@domain/usecases'
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
        surveyId: surveyResult.surveyId,
        accountId: surveyResult.accountId
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
}
