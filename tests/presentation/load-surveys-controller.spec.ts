import MockDate from 'mockdate'
import { LoadSurveys } from '../../src/domain/usecases'
import { LoadSurveysController } from '../../src/presentation/controller'
import { serverError, successResponse } from '../../src/presentation/helpers'
import { Controller } from '../../src/presentation/protocols'
import { LoadSurveysStub, makeFakeSuyrveys } from './mocks/load-surveys'

interface SutTypes {
  sut: Controller
  loadSurveysStub: LoadSurveys
}

const makeSut = (): SutTypes => {
  const loadSurveysStub = new LoadSurveysStub()
  const sut = new LoadSurveysController(loadSurveysStub)

  return {
    sut,
    loadSurveysStub
  }
}

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call LoadSurveys', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')

    await sut.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })

  test('should return 200 on success', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(successResponse(makeFakeSuyrveys()))
  })

  test('should return 500 if LoadSurveys throws', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
