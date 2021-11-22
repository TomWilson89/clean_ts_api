import MockDate from 'mockdate'
import { LoadSurveys } from '../../src/domain/usecases'
import { LoadSurveysController } from '../../src/presentation/controller'
import { Controller } from '../../src/presentation/protocols'
import { LoadSurveysStub } from './mocks/load-surveys'

interface SutTypes {
  sut: Controller
  loadSurveysStub: LoadSurveys
}

const makeSut = (): SutTypes => {
  const loadSurveysStub = new LoadSurveysStub()
  const sut = new LoadSurveysController(loadSurveysStub)

  return {
    sut,
    loadSurveysStub
  }
}

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call LoadSurveys', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')

    await sut.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })
})
