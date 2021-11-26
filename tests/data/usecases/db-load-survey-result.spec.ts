import { mockSurveyResultModel } from '@/tests/domain/mocks'
import { LoadSurveyResultRepository } from '@data/protocols'
import { DbLoadSurveyResult } from '@data/usecases'
import { LoadSurveyResult } from '@domain/usecases'
import { LoadSurveyResultRepositoryStub } from '../mocks'

type SutTypes = {
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
  sut: LoadSurveyResult
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = new LoadSurveyResultRepositoryStub()

  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub)

  return {
    sut,
    loadSurveyResultRepositoryStub
  }
}

describe('DbLoadSurveyResult', () => {
  test('should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(
      loadSurveyResultRepositoryStub,
      'loadBySurveyId'
    )
    const surveyId = 'any_survey_id'
    await sut.load(surveyId)
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith(surveyId)
  })

  test('should return survey result model if LoadSurveyResultRepository succedd', async () => {
    const { sut } = makeSut()
    const surveyResultModel = await sut.load('any_survey_id')
    expect(surveyResultModel).toEqual(mockSurveyResultModel())
  })

  test('should throw is LoadSurveyResultRepository throws', async () => {
    const { loadSurveyResultRepositoryStub, sut } = makeSut()
    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockRejectedValueOnce(new Error())

    const promise = sut.load('any_survey_id')
    await expect(promise).rejects.toThrow()
  })
})
