import { SurveyModel } from './../../../src/domain/models'
import { LoadSurveys } from './../../../src/domain/usecases'

export const makeFakeSuyrveys = (): SurveyModel[] => {
  const fakeSurveys = [
    {
      id: 'valid_id',
      question: 'valid_question',
      answers: [
        {
          image: 'valid_image',
          answer: 'valid_answer'
        }
      ],
      date: new Date()
    }
  ]

  return fakeSurveys
}
export class LoadSurveysStub implements LoadSurveys {
  async load(): Promise<SurveyModel[]> {
    return makeFakeSuyrveys()
  }
}
