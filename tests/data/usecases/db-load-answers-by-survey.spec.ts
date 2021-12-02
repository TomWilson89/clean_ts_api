import { DbLoadAnswersBySurvey } from '@data/usecases'
import { LoadAnswersBySurvey } from '@domain/usecases'
import faker from 'faker'
import { LoadAnswersBySurveyRepositorySpy } from '../mocks'

type SutTypes = {
  sut: LoadAnswersBySurvey
  loadAnswersBySurveyRepositorySpy: LoadAnswersBySurveyRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadAnswersBySurveyRepositorySpy =
    new LoadAnswersBySurveyRepositorySpy()
  const sut = new DbLoadAnswersBySurvey(loadAnswersBySurveyRepositorySpy)

  return {
    sut,
    loadAnswersBySurveyRepositorySpy
  }
}
describe('DbLoadSurveyById', () => {
  test('should LoadAnswersSurveyRepository with correct values', async () => {
    const { loadAnswersBySurveyRepositorySpy, sut } = makeSut()

    const surveyId = faker.datatype.uuid()
    await sut.loadAnswers(surveyId)
    expect(loadAnswersBySurveyRepositorySpy.id).toBe(surveyId)
  })

  test('should return answers on success', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut()
    const answers = await sut.loadAnswers(faker.datatype.uuid())
    expect(answers).toEqual([
      loadAnswersBySurveyRepositorySpy.result[0],
      loadAnswersBySurveyRepositorySpy.result[1]
    ])
  })

  test('should return empty array if LoadAnswersSurveyRepository return empty array', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut()

    loadAnswersBySurveyRepositorySpy.result = []

    const answers = await sut.loadAnswers(faker.datatype.uuid())
    expect(answers).toEqual([])
  })

  test('should throw is LoadAnswersSurveyRepository throws', async () => {
    const { loadAnswersBySurveyRepositorySpy, sut } = makeSut()
    jest
      .spyOn(loadAnswersBySurveyRepositorySpy, 'loadAnswers')
      .mockRejectedValueOnce(new Error())

    const promise = sut.loadAnswers(faker.datatype.uuid())
    await expect(promise).rejects.toThrow()
  })
})
