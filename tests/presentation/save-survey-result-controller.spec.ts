import { SaveSurveyResultController } from '@presentation/controller'
import { InvalidParamError } from '@presentation/errors'
import { forbidden, serverError, successResponse } from '@presentation/helpers'
import { Controller } from '@presentation/protocols'
import faker from 'faker'
import MockDate from 'mockdate'
import { LoadSurveyAnswersBySurveySpy, SaveSurveyResultSpy } from './mocks'

const mockRequest = (answer = null): SaveSurveyResultController.Request => {
  return {
    surveyId: faker.datatype.uuid(),
    answer,
    accountId: faker.datatype.uuid()
  }
}

type SutTypes = {
  saveSurveyResultSpy: SaveSurveyResultSpy
  loadAnswersBySurveypy: LoadSurveyAnswersBySurveySpy
  sut: Controller
}

const makeSut = (): SutTypes => {
  const saveSurveyResultSpy = new SaveSurveyResultSpy()
  const loadAnswersBySurveypy = new LoadSurveyAnswersBySurveySpy()
  const sut = new SaveSurveyResultController(
    loadAnswersBySurveypy,
    saveSurveyResultSpy
  )

  return {
    sut,
    loadAnswersBySurveypy,
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

  test('should call LoadAnswersBySurvey with correct values', async () => {
    const { sut, loadAnswersBySurveypy } = makeSut()
    const request = mockRequest()

    await sut.handle(request)
    expect(loadAnswersBySurveypy.surveyId).toBe(request.surveyId)
  })

  test('should return 403 if LoadAnswersBySurvey returns empty array', async () => {
    const { sut, loadAnswersBySurveypy } = makeSut()

    loadAnswersBySurveypy.result = []

    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('should return 500 if LoadAnswersBySurvey throws', async () => {
    const { sut, loadAnswersBySurveypy } = makeSut()

    jest
      .spyOn(loadAnswersBySurveypy, 'loadAnswers')
      .mockRejectedValueOnce(new Error())

    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 403 if invalid answer is provided', async () => {
    const { sut } = makeSut()
    const request = mockRequest()
    request.answer = faker.random.words()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultSpy, loadAnswersBySurveypy } = makeSut()

    const request = mockRequest(loadAnswersBySurveypy.result[0])

    await sut.handle(request)
    expect(saveSurveyResultSpy.params).toEqual({
      surveyId: request.surveyId,
      accountId: request.accountId,
      answer: request.answer,
      date: new Date()
    })
  })

  test('should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultSpy, loadAnswersBySurveypy } = makeSut()

    jest.spyOn(saveSurveyResultSpy, 'save').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(
      mockRequest(loadAnswersBySurveypy.result[0])
    )

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 200 on success', async () => {
    const { sut, loadAnswersBySurveypy, saveSurveyResultSpy } = makeSut()
    const httpResponse = await sut.handle(
      mockRequest(loadAnswersBySurveypy.result[0])
    )

    expect(httpResponse).toEqual(successResponse(saveSurveyResultSpy.result))
  })
})
