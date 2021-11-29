import { LoadSurveyResult, LoadSurveysById } from '@domain/usecases'
import { LoadSurveyResultController } from '@presentation/controller'
import { InvalidParamError } from '@presentation/errors'
import { forbidden, serverError, successResponse } from '@presentation/helpers'
import { Controller, HttpRequest } from '@presentation/protocols'
import { mockSurveyResultModel } from '../domain/mocks'
import { LoadSurveyByIdStub, LoadSurveyResultStub } from './mocks'

const mockHttpRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_id'
  }
})

type SutTypes = {
  sut: Controller
  loadSurveyByIdStub: LoadSurveysById
  loadSurveyResultStub: LoadSurveyResult
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = new LoadSurveyByIdStub()
  const loadSurveyResultStub = new LoadSurveyResultStub()
  const sut = new LoadSurveyResultController(
    loadSurveyByIdStub,
    loadSurveyResultStub
  )

  return {
    sut,
    loadSurveyByIdStub,
    loadSurveyResultStub
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

  test('should return 500 if LoadSurveyuById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest
      .spyOn(loadSurveyByIdStub, 'loadById')
      .mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should call LoadSurveyResult with correct values', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultStub, 'load')
    await sut.handle(mockHttpRequest())
    expect(loadSpy).toHaveBeenCalledWith(mockHttpRequest().params.surveyId)
  })

  test('should return 500 if LoadSurveyResult throws', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    jest.spyOn(loadSurveyResultStub, 'load').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(successResponse(mockSurveyResultModel()))
  })
})
