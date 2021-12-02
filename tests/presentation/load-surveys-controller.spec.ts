import { LoadSurveysController } from '@presentation/controller'
import { noContent, serverError, successResponse } from '@presentation/helpers'
import { Controller, HttpRequest } from '@presentation/protocols'
import faker from 'faker'
import MockDate from 'mockdate'
import { LoadSurveysSpy } from './mocks'

const mockRequest = (): HttpRequest => {
  return {
    accountId: faker.datatype.uuid()
  }
}

type SutTypes = {
  sut: Controller
  loadSurveysSpy: LoadSurveysSpy
}

const makeSut = (): SutTypes => {
  const loadSurveysSpy = new LoadSurveysSpy()
  const sut = new LoadSurveysController(loadSurveysSpy)

  return {
    sut,
    loadSurveysSpy
  }
}

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call LoadSurveys with correct value', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    const httpRequest = mockRequest()

    await sut.handle(httpRequest)
    expect(loadSurveysSpy.accountId).toBe(httpRequest.accountId)
  })

  test('should return 200 on success', async () => {
    const { sut, loadSurveysSpy } = makeSut()

    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(successResponse(loadSurveysSpy.result))
  })

  test('should return 204 if LoadSurveys returns empty array', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    loadSurveysSpy.result = []
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(noContent())
  })

  test('should return 500 if LoadSurveys throws', async () => {
    const { sut, loadSurveysSpy } = makeSut()
    jest.spyOn(loadSurveysSpy, 'load').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
