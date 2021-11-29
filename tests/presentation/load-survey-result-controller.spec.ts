import { LoadSurveysById } from '@domain/usecases'
import { LoadSurveyResultController } from '@presentation/controller'
import { InvalidParamError } from '@presentation/errors'
import { forbidden } from '@presentation/helpers'
import { Controller, HttpRequest } from '@presentation/protocols'
import { LoadSurveyByIdStub } from './mocks'

const mockHttpRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_id'
  }
})

type SutTypes = {
  sut: Controller
  loadSurveyByIdStub: LoadSurveysById
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = new LoadSurveyByIdStub()
  const sut = new LoadSurveyResultController(loadSurveyByIdStub)

  return {
    sut,
    loadSurveyByIdStub
  }
}
describe('LoadSurveyResult controller', () => {
  test('should call LoadSurveyById wir correct value', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(mockHttpRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith(mockHttpRequest().params.surveyId)
  })

  test('should return 403 if no LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })
})
