import { LoadSurveyResultController } from '@presentation/controller'
import { InvalidParamError } from '@presentation/errors'
import { forbidden, serverError, successResponse } from '@presentation/helpers'
import { Controller } from '@presentation/protocols'
import faker from 'faker'
import MockDate from 'mockdate'
import { CheckSurveyByIdSpy, LoadSurveyResultSpy } from './mocks'

const mockRequest = (): LoadSurveyResultController.Request => ({
  surveyId: faker.datatype.uuid(),
  accountId: faker.datatype.uuid()
})

type SutTypes = {
  sut: Controller
  checkSurveyByIdSpy: CheckSurveyByIdSpy
  loadSurveyResultSpy: LoadSurveyResultSpy
}

const makeSut = (): SutTypes => {
  const checkSurveyByIdSpy = new CheckSurveyByIdSpy()
  const loadSurveyResultSpy = new LoadSurveyResultSpy()
  const sut = new LoadSurveyResultController(
    checkSurveyByIdSpy,
    loadSurveyResultSpy
  )

  return {
    sut,
    checkSurveyByIdSpy,
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

  test('should call checkSurveyById wir correct value', async () => {
    const { sut, checkSurveyByIdSpy } = makeSut()
    const request = mockRequest()

    await sut.handle(request)
    expect(checkSurveyByIdSpy.surveyId).toBe(request.surveyId)
  })

  test('should return 403 if no checkSurveyById returns false', async () => {
    const { sut, checkSurveyByIdSpy } = makeSut()

    checkSurveyByIdSpy.result = false

    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('should return 500 if LoadSurveyuById throws', async () => {
    const { sut, checkSurveyByIdSpy } = makeSut()
    jest
      .spyOn(checkSurveyByIdSpy, 'checkById')
      .mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should call LoadSurveyResult with correct values', async () => {
    const { sut, loadSurveyResultSpy } = makeSut()

    const request = mockRequest()
    await sut.handle(request)
    expect(loadSurveyResultSpy.surveyId).toBe(request.surveyId)
    expect(loadSurveyResultSpy.accountId).toBe(request.accountId)
  })

  test('should return 500 if LoadSurveyResult throws', async () => {
    const { sut, loadSurveyResultSpy } = makeSut()
    jest.spyOn(loadSurveyResultSpy, 'load').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 200 on success', async () => {
    const { sut, loadSurveyResultSpy } = makeSut()

    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(successResponse(loadSurveyResultSpy.result))
  })
})
