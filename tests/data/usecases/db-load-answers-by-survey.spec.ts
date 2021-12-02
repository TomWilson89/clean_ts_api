import { DbLoadAnswersBySurvey } from '@data/usecases'
import { LoadAnswersBySurvey } from '@domain/usecases'
import faker from 'faker'
import { LoadSurveyByIdRepositorySpy } from '../mocks'

type SutTypes = {
  sut: LoadAnswersBySurvey
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy()
  const sut = new DbLoadAnswersBySurvey(loadSurveyByIdRepositorySpy)

  return {
    sut,
    loadSurveyByIdRepositorySpy
  }
}
describe('DbLoadSurveyById', () => {
  test('should LoadSurveyByIdRepository with correct values', async () => {
    const { loadSurveyByIdRepositorySpy, sut } = makeSut()

    const surveyId = faker.datatype.uuid()
    await sut.loadAnswers(surveyId)
    expect(loadSurveyByIdRepositorySpy.id).toBe(surveyId)
  })

  test('should return answers on success', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    const answers = await sut.loadAnswers(faker.datatype.uuid())
    expect(answers).toEqual([
      loadSurveyByIdRepositorySpy.result.answers[0].answer,
      loadSurveyByIdRepositorySpy.result.answers[1].answer
    ])
  })

  test('should return empty array if LoadSurveyByIdRepository return null', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()

    loadSurveyByIdRepositorySpy.result = null

    const answers = await sut.loadAnswers(faker.datatype.uuid())
    expect(answers).toEqual([])
  })

  test('should throw is LoadSurveyByIdRepository throws', async () => {
    const { loadSurveyByIdRepositorySpy, sut } = makeSut()
    jest
      .spyOn(loadSurveyByIdRepositorySpy, 'loadById')
      .mockRejectedValueOnce(new Error())

    const promise = sut.loadAnswers(faker.datatype.uuid())
    await expect(promise).rejects.toThrow()
  })
})
