import { LoadSurveysById } from '@domain/usecases'
import { SaveSurveyResultController } from '@presentation/controller'
import { Controller, HttpRequest } from '@presentation/protocols'
import { LoadSurveyByIdStub } from './mocks'

const makeFakeRequest = (): HttpRequest => {
  return {
    params: {
      surveyId: 'any_survey_id'
    }
  }
}

type SutTypes = {
  loadSurveyByIdStub: LoadSurveysById
  sut: Controller
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = new LoadSurveyByIdStub()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub)

  return {
    sut,
    loadSurveyByIdStub
  }
}

describe('SaveSurveyResult controller', () => {
  test('should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdStub = jest.spyOn(loadSurveyByIdStub, 'loadById')

    await sut.handle(makeFakeRequest())
    expect(loadByIdStub).toHaveBeenCalledWith(makeFakeRequest().params.surveyId)
  })
})
