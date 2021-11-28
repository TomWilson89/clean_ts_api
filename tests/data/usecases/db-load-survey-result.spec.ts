import { mockSurveyResultModel } from '@/tests/domain/mocks'
import {
  LoadSurveyByIdRepository,
  LoadSurveyResultRepository
} from '@data/protocols'
import { DbLoadSurveyResult } from '@data/usecases'
import { LoadSurveyResult } from '@domain/usecases'
import {
  LoadSurveyByIdRepositoryStub,
  LoadSurveyResultRepositoryStub
} from '../mocks'

type SutTypes = {
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
  sut: LoadSurveyResult
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = new LoadSurveyResultRepositoryStub()
  const loadSurveyByIdRepositoryStub = new LoadSurveyByIdRepositoryStub()

  const sut = new DbLoadSurveyResult(
    loadSurveyResultRepositoryStub,
    loadSurveyByIdRepositoryStub
  )

  return {
    sut,
    loadSurveyResultRepositoryStub,
    loadSurveyByIdRepositoryStub
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

  test('should return LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const {
      sut,
      loadSurveyResultRepositoryStub,
      loadSurveyByIdRepositoryStub
    } = makeSut()
    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockResolvedValueOnce(null)
    const loadSurveyByIdSpy = jest.spyOn(
      loadSurveyByIdRepositoryStub,
      'loadById'
    )
    const surveyId = 'any_survey_id'
    await sut.load(surveyId)
    expect(loadSurveyByIdSpy).toHaveBeenCalledWith(surveyId)
  })
})
