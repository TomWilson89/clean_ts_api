import MockDate from 'mockdate'
import { LoadSurveysRepository } from '../../../src/data/protocols'
import { DbLoadSurveys } from '../../../src/data/usecases'
import { SurveyModel } from '../../../src/domain/models'
import { LoadSurveys } from '../../../src/domain/usecases'
import { LoadSurveysRepositoryStub } from '../mocks/'

const makeFakeSurvey = (): SurveyModel[] => {
  const fakeSurveys = [
    {
      id: 'valid_id',
      question: 'valid_question',
      answers: [
        {
          image: 'valid_image',
          answer: 'valid_answer'
        }
      ],
      date: new Date()
    }
  ]
  return fakeSurveys
}
interface SutTypes {
  sut: LoadSurveys
  loadSurveysRepositoryStub: LoadSurveysRepository
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = new LoadSurveysRepositoryStub()
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub)

  return {
    sut,
    loadSurveysRepositoryStub
  }
}

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  test('should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
    await sut.load()
    expect(loadAllSpy).toHaveBeenCalled()
  })

  test('should return a list of surveys if LoadSurveysRepository success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.load()
    expect(httpResponse).toEqual(makeFakeSurvey())
  })

  test('should throw is LoadSurveysRepository throws', async () => {
    const { loadSurveysRepositoryStub, sut } = makeSut()
    jest
      .spyOn(loadSurveysRepositoryStub, 'loadAll')
      .mockRejectedValueOnce(new Error())

    const promise = sut.load()
    await expect(promise).rejects.toThrow()
  })
})
