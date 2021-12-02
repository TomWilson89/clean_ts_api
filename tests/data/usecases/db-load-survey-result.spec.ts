import { DbLoadSurveyResult } from '@data/usecases'
import { LoadSurveyResult } from '@domain/usecases'
import faker from 'faker'
import MockDate from 'mockdate'
import {
  LoadSurveyByIdRepositorySpy,
  LoadSurveyResultRepositorySpy
} from '../mocks'

type SutTypes = {
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy
  sut: LoadSurveyResult
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy()
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy()

  const sut = new DbLoadSurveyResult(
    loadSurveyResultRepositorySpy,
    loadSurveyByIdRepositorySpy
  )

  return {
    sut,
    loadSurveyResultRepositorySpy,
    loadSurveyByIdRepositorySpy
  }
}

describe('DbLoadSurveyResult', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()

    const surveyId = faker.datatype.uuid()
    const accountId = faker.datatype.uuid()
    await sut.load(surveyId, accountId)
    expect(loadSurveyResultRepositorySpy.surveyId).toBe(surveyId)
    expect(loadSurveyResultRepositorySpy.accountId).toBe(accountId)
  })

  test('should return survey result model if LoadSurveyResultRepository succeed', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    const surveyResultModel = await sut.load(
      faker.datatype.uuid(),
      faker.datatype.uuid()
    )
    expect(surveyResultModel).toEqual(loadSurveyResultRepositorySpy.result)
  })

  test('should throw is LoadSurveyResultRepository throws', async () => {
    const { loadSurveyResultRepositorySpy, sut } = makeSut()
    jest
      .spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId')
      .mockRejectedValueOnce(new Error())

    const promise = sut.load(faker.datatype.uuid(), faker.datatype.uuid())
    await expect(promise).rejects.toThrow()
  })

  test('should return LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy } =
      makeSut()

    loadSurveyResultRepositorySpy.result = null

    const surveyId = faker.datatype.uuid()
    const accountId = faker.datatype.uuid()
    await sut.load(surveyId, accountId)
    expect(loadSurveyByIdRepositorySpy.id).toBe(surveyId)
  })

  test('should return survey result model with all answers and count 0 if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy } =
      makeSut()
    const surveyId = faker.datatype.uuid()
    const accountId = faker.datatype.uuid()

    loadSurveyResultRepositorySpy.result = null

    const surveyResult = await sut.load(surveyId, accountId)
    const { result } = loadSurveyByIdRepositorySpy

    expect(surveyResult).toEqual({
      surveyId: result.id,
      question: result.question,
      date: result.date,
      answers: result.answers.map((answer) => ({
        ...answer,
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false
      }))
    })
  })
})
