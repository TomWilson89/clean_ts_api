import { LoadSurveyResultController } from '@presentation/controller'
import { InvalidParamError } from '@presentation/errors'
import { forbidden, serverError, successResponse } from '@presentation/helpers'
import { Controller, HttpRequest } from '@presentation/protocols'
import faker from 'faker'
import MockDate from 'mockdate'
import { LoadSurveyByIdSpy, LoadSurveyResultSpy } from './mocks'

const mockHttpRequest = (): HttpRequest => ({
  params: {
    surveyId: faker.datatype.uuid()
  },
  accountId: faker.datatype.uuid()
})

type SutTypes = {
  sut: Controller
  loadSurveyByIdSpy: LoadSurveyByIdSpy
  loadSurveyResultSpy: LoadSurveyResultSpy
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdSpy = new LoadSurveyByIdSpy()
  const loadSurveyResultSpy = new LoadSurveyResultSpy()
  const sut = new LoadSurveyResultController(
    loadSurveyByIdSpy,
    loadSurveyResultSpy
  )

  return {
    sut,
    loadSurveyByIdSpy,
    loadSurveyResultSpy
  }
}
describe('LoadSurveyResult controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call LoadSurveyById wir correct value', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()
    const httpRequest = mockHttpRequest()

    await sut.handle(httpRequest)
    expect(loadSurveyByIdSpy.surveyId).toBe(httpRequest.params.surveyId)
  })

  test('should return 403 if no LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()

    loadSurveyByIdSpy.result = null

    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('should return 500 if LoadSurveyuById throws', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()
    jest.spyOn(loadSurveyByIdSpy, 'loadById').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should call LoadSurveyResult with correct values', async () => {
    const { sut, loadSurveyResultSpy } = makeSut()

    const httpRequest = mockHttpRequest()
    await sut.handle(httpRequest)
    expect(loadSurveyResultSpy.surveyId).toBe(httpRequest.params.surveyId)
    expect(loadSurveyResultSpy.accountId).toBe(httpRequest.accountId)
  })

  test('should return 500 if LoadSurveyResult throws', async () => {
    const { sut, loadSurveyResultSpy } = makeSut()
    jest.spyOn(loadSurveyResultSpy, 'load').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 200 on success', async () => {
    const { sut, loadSurveyResultSpy } = makeSut()

    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(successResponse(loadSurveyResultSpy.result))
  })
})
