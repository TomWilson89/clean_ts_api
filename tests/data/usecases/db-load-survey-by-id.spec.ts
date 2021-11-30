import { DbLoadSurveyById } from '@data/usecases'
import { LoadSurveysById } from '@domain/usecases'
import faker from 'faker'
import MockDate from 'mockdate'
import { LoadSurveyByIdRepositorySpy } from '../mocks'

type SutTypes = {
  sut: LoadSurveysById
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy()
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositorySpy)

  return {
    sut,
    loadSurveyByIdRepositorySpy
  }
}
describe('DbLoadSurveyById', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  test('should LoadSurveyByIdRepository with correct values', async () => {
    const { loadSurveyByIdRepositorySpy, sut } = makeSut()

    const surveyId = faker.datatype.uuid()
    await sut.loadById(surveyId)
    expect(loadSurveyByIdRepositorySpy.id).toBe(surveyId)
  })

  test('should return a survey on success', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    const survey = await sut.loadById(faker.datatype.uuid())
    expect(survey).toEqual(loadSurveyByIdRepositorySpy.result)
  })

  test('should throw is LoadSurveyByIdRepository throws', async () => {
    const { loadSurveyByIdRepositorySpy, sut } = makeSut()
    jest
      .spyOn(loadSurveyByIdRepositorySpy, 'loadById')
      .mockRejectedValueOnce(new Error())

    const promise = sut.loadById(faker.datatype.uuid())
    await expect(promise).rejects.toThrow()
  })
})
