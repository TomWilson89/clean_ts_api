import {
  mockSurveyResultModel,
  mockSurveyResultParams
} from '@/tests/domain/mocks'
import {
  LoadSurveyResultRepository,
  SaveSurveyResultRepository
} from '@data/protocols'
import { DbSaveSurveyResult } from '@data/usecases'
import { SaveSurveyResult } from '@domain/usecases'
import MockDate from 'mockdate'
import {
  LoadSurveyResultRepositoryStub,
  SaveSurveyResultRepositoryStub
} from '../mocks'

type SutTypes = {
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
  sut: SaveSurveyResult
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = new SaveSurveyResultRepositoryStub()
  const loadSurveyResultRepositoryStub = new LoadSurveyResultRepositoryStub()
  const sut = new DbSaveSurveyResult(
    saveSurveyResultRepositoryStub,
    loadSurveyResultRepositoryStub
  )
  return {
    sut,
    saveSurveyResultRepositoryStub,
    loadSurveyResultRepositoryStub
  }
}
describe('DbSaveSurveyResult', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call SaveSurveyResultRepository with corect values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
    const surveyResultParams = mockSurveyResultParams()
    await sut.save(surveyResultParams)
    expect(saveSpy).toHaveBeenCalledWith(surveyResultParams)
  })

  test('should call LoadSurveyRestultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(
      loadSurveyResultRepositoryStub,
      'loadBySurveyId'
    )
    const surveyResultData = mockSurveyResultParams()
    await sut.save(surveyResultData)
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith(surveyResultData.surveyId)
  })

  test('should return a survey result on success', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.save(mockSurveyResultParams())
    expect(surveyResult).toEqual(mockSurveyResultModel())
  })

  test('should throw is SaveSurveyResultRepository throws', async () => {
    const { saveSurveyResultRepositoryStub, sut } = makeSut()
    jest
      .spyOn(saveSurveyResultRepositoryStub, 'save')
      .mockRejectedValueOnce(new Error())

    const promise = sut.save(mockSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })

  test('should throw is LoadSurveyRestultRepository throws', async () => {
    const { loadSurveyResultRepositoryStub, sut } = makeSut()
    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockRejectedValueOnce(new Error())

    const promise = sut.save(mockSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })
})
