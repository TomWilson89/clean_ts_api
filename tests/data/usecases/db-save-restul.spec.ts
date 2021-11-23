import { SaveSurveyResultRepository } from '@data/protocols'
import { DbSaveSurveyResult } from '@data/usecases'
import { SaveSurveyResult, SaveSurveyResultModel } from '@domain/usecases'
import MockDate from 'mockdate'
import { SaveSurveyResultRepositoryStub } from '../mocks'

const makeFakeSurveyResultData = (): SaveSurveyResultModel => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date()
})

type SutTypes = {
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
  sut: SaveSurveyResult
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = new SaveSurveyResultRepositoryStub()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)
  return {
    sut,
    saveSurveyResultRepositoryStub
  }
}
describe('DbSaveSurveyREsult', () => {
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
})
