import { DbLoadSurveys } from '@data/usecases'
import { LoadSurveys } from '@domain/usecases'
import MockDate from 'mockdate'
import { LoadSurveysRepositorySpy } from '../mocks/'

type SutTypes = {
  sut: LoadSurveys
  loadSurveysRepositorySpy: LoadSurveysRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositorySpy = new LoadSurveysRepositorySpy()
  const sut = new DbLoadSurveys(loadSurveysRepositorySpy)

  return {
    sut,
    loadSurveysRepositorySpy
  }
}

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  test('should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut()
    const loadAllSpy = jest.spyOn(loadSurveysRepositorySpy, 'loadAll')
    await sut.load()
    expect(loadAllSpy).toHaveBeenCalled()
  })

  test('should return a list of surveys if LoadSurveysRepository success', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut()
    const httpResponse = await sut.load()
    expect(httpResponse).toEqual(loadSurveysRepositorySpy.result)
  })

  test('should throw is LoadSurveysRepository throws', async () => {
    const { loadSurveysRepositorySpy, sut } = makeSut()
    jest
      .spyOn(loadSurveysRepositorySpy, 'loadAll')
      .mockRejectedValueOnce(new Error())

    const promise = sut.load()
    await expect(promise).rejects.toThrow()
  })
})
