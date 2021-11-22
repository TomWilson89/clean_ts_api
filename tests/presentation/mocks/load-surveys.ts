import { SurveyModel } from './../../../src/domain/models'
import { LoadSurveys } from './../../../src/domain/usecases'

export class LoadSurveysStub implements LoadSurveys {
  async load(): Promise<SurveyModel[]> {
    return null
  }
}
