import { LoadSurveyByIdRepository } from '@data/protocols'
import { DbLoadSurveyById } from '@data/usecases'
import { SurveyModel } from '@domain/models'
import { LoadSurveysById } from '@domain/usecases'
import MockDate from 'mockdate'
import { LoadSurveyByIdRepositoryStub } from '../mocks'

const makeFakeSurvey = (): SurveyModel => {
  return {
    id: 'valid_id',
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      }
    ],
    date: new Date()
  }
}

type SutTypes = {
  sut: LoadSurveysById
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = new LoadSurveyByIdRepositoryStub()
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)

  return {
    sut,
    loadSurveyByIdRepositoryStub
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
    const { loadSurveyByIdRepositoryStub, sut } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await sut.loadById('any_id')
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })

  test('should return a survey on success', async () => {
    const { sut } = makeSut()
    const survey = await sut.loadById('any_id')
    expect(survey).toEqual(makeFakeSurvey())
  })

  test('should throw is LoadSurveyByIdRepository throws', async () => {
    const { loadSurveyByIdRepositoryStub, sut } = makeSut()
    jest
      .spyOn(loadSurveyByIdRepositoryStub, 'loadById')
      .mockRejectedValueOnce(new Error())

    const promise = sut.loadById('any_id')
    await expect(promise).rejects.toThrow()
  })
})
