import { SaveSurveyResultRepository } from '@data/protocols/'
import { SaveSurveyResultModel } from '@domain/usecases'
import { MongoHelper } from '.'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save(surveyResult: SaveSurveyResultModel): Promise<void> {
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
}
