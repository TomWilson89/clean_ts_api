import {
  LoadSurveyResultRepository,
  SaveSurveyResultRepository
} from '@data/protocols'
import { DbSaveSurveyResult } from '@data/usecases'
import { SurveyResultModel } from '@domain/models'
import { SaveSurveyResult, SaveSurveyResultModel } from '@domain/usecases'
import MockDate from 'mockdate'
import {
  LoadSurveyResultRepositoryStub,
  SaveSurveyResultRepositoryStub
} from '../mocks'

const makeFakeSurveyResult = (): SurveyResultModel =>
  Object.assign({}, makeFakeSurveyResultData(), { id: 'valid_id' })

const makeFakeSurveyResultData = (): SaveSurveyResultModel => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date()
})

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
    const surveyResultData = makeFakeSurveyResultData()
    await sut.save(surveyResultData)
    expect(saveSpy).toHaveBeenCalledWith(surveyResultData)
  })

  test('should call LoadSurveyRestultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(
      loadSurveyResultRepositoryStub,
      'loadBySurveyId'
    )
    const surveyResultData = makeFakeSurveyResultData()
    await sut.save(surveyResultData)
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith(
      surveyResultData.surveyId,
      surveyResultData.accountId
    )
  })

  test('should return a survey result on success', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.save(makeFakeSurveyResultData())
    expect(surveyResult).toEqual(makeFakeSurveyResult())
  })

  test('should throw is SaveSurveyResultRepository throws', async () => {
    const { saveSurveyResultRepositoryStub, sut } = makeSut()
    jest
      .spyOn(saveSurveyResultRepositoryStub, 'save')
      .mockRejectedValueOnce(new Error())

    const promise = sut.save(makeFakeSurveyResultData())
    await expect(promise).rejects.toThrow()
  })
})
