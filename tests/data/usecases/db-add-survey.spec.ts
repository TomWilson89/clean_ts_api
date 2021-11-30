import { mockAddSurveyParams } from '@/tests/domain/mocks'
import { DbAddSurvey } from '@data/usecases'
import { AddSurvey } from '@domain/usecases'
import { ServerError } from '@presentation/errors'
import MockDate from 'mockdate'
import { AddSurveyRepositorySpy } from '../mocks/mock-add-survey-repository'

type SutTypes = {
  sut: AddSurvey
  addSurveyRepositorySpy: AddSurveyRepositorySpy
}

const makeSut = (): SutTypes => {
  const addSurveyRepositorySpy = new AddSurveyRepositorySpy()
  const sut = new DbAddSurvey(addSurveyRepositorySpy)

  return {
    sut,
    addSurveyRepositorySpy
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
    const { sut, addSurveyRepositorySpy } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositorySpy, 'add')
    const surveyParams = mockAddSurveyParams()
    await sut.add(surveyParams)
    expect(addSpy).toHaveBeenCalledWith(surveyParams)
  })

  test('should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositorySpy } = makeSut()
    const error = new ServerError()
    jest.spyOn(addSurveyRepositorySpy, 'add').mockRejectedValueOnce(error)

    const promise = sut.add(mockAddSurveyParams())
    await expect(promise).rejects.toThrow()
  })
})
