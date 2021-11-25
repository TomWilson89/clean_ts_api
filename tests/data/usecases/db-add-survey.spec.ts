import { mockAddSurveyParams } from '@/tests/domain/mocks'
import { AddSurveyRepository } from '@data/protocols/'
import { DbAddSurvey } from '@data/usecases'
import { AddSurvey } from '@domain/usecases'
import { ServerError } from '@presentation/errors'
import MockDate from 'mockdate'
import { AddSurveyRepositoryStub } from '../mocks/mock-add-survey-repository'

type SutTypes = {
  sut: AddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = new AddSurveyRepositoryStub()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)

  return {
    sut,
    addSurveyRepositoryStub
  }
}

describe('DbAddSurvey Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const surveyParams = mockAddSurveyParams()
    await sut.add(surveyParams)
    expect(addSpy).toHaveBeenCalledWith(surveyParams)
  })

  test('should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const error = new ServerError()
    jest.spyOn(addSurveyRepositoryStub, 'add').mockRejectedValueOnce(error)

    const promise = sut.add(mockAddSurveyParams())
    await expect(promise).rejects.toThrow()
  })
})
