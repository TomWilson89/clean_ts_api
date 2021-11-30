import { mockSurveyResultParams } from '@/tests/domain/mocks'
import { DbSaveSurveyResult } from '@data/usecases'
import { SaveSurveyResult } from '@domain/usecases'
import MockDate from 'mockdate'
import {
  LoadSurveyResultRepositorySpy,
  SaveSurveyResultRepositorySpy
} from '../mocks'

type SutTypes = {
  saveSurveyResultRepositorySpy: SaveSurveyResultRepositorySpy
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy
  sut: SaveSurveyResult
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositorySpy = new SaveSurveyResultRepositorySpy()
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy()
  const sut = new DbSaveSurveyResult(
    saveSurveyResultRepositorySpy,
    loadSurveyResultRepositorySpy
  )
  return {
    sut,
    saveSurveyResultRepositorySpy,
    loadSurveyResultRepositorySpy
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
    const { sut, saveSurveyResultRepositorySpy } = makeSut()

    const surveyResultParams = mockSurveyResultParams()
    await sut.save(surveyResultParams)
    expect(saveSurveyResultRepositorySpy.params).toEqual(surveyResultParams)
  })

  test('should call LoadSurveyRestultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    const surveyResultData = mockSurveyResultParams()
    await sut.save(surveyResultData)

    expect(loadSurveyResultRepositorySpy.surveyId).toBe(
      surveyResultData.surveyId
    )
  })

  test('should return a survey result on success', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    const surveyResult = await sut.save(mockSurveyResultParams())
    expect(surveyResult).toEqual(loadSurveyResultRepositorySpy.result)
  })

  test('should throw is SaveSurveyResultRepository throws', async () => {
    const { saveSurveyResultRepositorySpy, sut } = makeSut()
    jest
      .spyOn(saveSurveyResultRepositorySpy, 'save')
      .mockRejectedValueOnce(new Error())

    const promise = sut.save(mockSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })

  test('should throw is LoadSurveyRestultRepository throws', async () => {
    const { loadSurveyResultRepositorySpy, sut } = makeSut()
    jest
      .spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId')
      .mockRejectedValueOnce(new Error())

    const promise = sut.save(mockSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })
})
