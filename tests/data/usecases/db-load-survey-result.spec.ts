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
})
