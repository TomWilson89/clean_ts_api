import { SaveSurveyResultController } from '@presentation/controller'
import { InvalidParamError } from '@presentation/errors'
import { forbidden, serverError, successResponse } from '@presentation/helpers'
import { Controller, HttpRequest } from '@presentation/protocols'
import faker from 'faker'
import MockDate from 'mockdate'
import { LoadSurveyByIdSpy, SaveSurveyResultSpy } from './mocks'

const mockRequest = (answer = null): HttpRequest => {
  return {
    params: {
      surveyId: faker.datatype.uuid()
    },
    body: {
      answer
    },
    accountId: faker.datatype.uuid()
  }
}

type SutTypes = {
  saveSurveyResultSpy: SaveSurveyResultSpy
  loadSurveyByIdSpy: LoadSurveyByIdSpy
  sut: Controller
}

const makeSut = (): SutTypes => {
  const saveSurveyResultSpy = new SaveSurveyResultSpy()
  const loadSurveyByIdSpy = new LoadSurveyByIdSpy()
  const sut = new SaveSurveyResultController(
    loadSurveyByIdSpy,
    saveSurveyResultSpy
  )

  return {
    sut,
    loadSurveyByIdSpy,
    saveSurveyResultSpy
  }
}

describe('SaveSurveyResult controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()
    const httpRequest = mockRequest()

    await sut.handle(httpRequest)
    expect(loadSurveyByIdSpy.surveyId).toBe(httpRequest.params.surveyId)
  })

  test('should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()

    loadSurveyByIdSpy.result = null

    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()

    jest.spyOn(loadSurveyByIdSpy, 'loadById').mockRejectedValueOnce(new Error())

    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 403 if invalid answer is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = mockRequest()
    httpRequest.body.answer = faker.random.words()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultSpy, loadSurveyByIdSpy } = makeSut()

    const httpRequest = mockRequest(loadSurveyByIdSpy.result.answers[0].answer)

    await sut.handle(httpRequest)
    expect(saveSurveyResultSpy.params).toEqual({
      surveyId: httpRequest.params.surveyId,
      accountId: httpRequest.accountId,
      answer: httpRequest.body.answer,
      date: new Date()
    })
  })

  test('should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultSpy, loadSurveyByIdSpy } = makeSut()

    jest.spyOn(saveSurveyResultSpy, 'save').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(
      mockRequest(loadSurveyByIdSpy.result.answers[0].answer)
    )

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 200 on success', async () => {
    const { sut, loadSurveyByIdSpy, saveSurveyResultSpy } = makeSut()
    const httpResponse = await sut.handle(
      mockRequest(loadSurveyByIdSpy.result.answers[0].answer)
    )

    expect(httpResponse).toEqual(successResponse(saveSurveyResultSpy.result))
  })
})
