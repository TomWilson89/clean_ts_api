import { AddSurveyRepository } from '../../../src/data/protocols/db/surveys'
import { DbAddSurvey } from '../../../src/data/usecases'
import { AddSurvey, AddSurveyModel } from '../../../src/domain/usecases'
import { ServerError } from '../../../src/presentation/errors'
import { AddSurveyRepositoryStub } from '../mocks/mock-add-survey-repository'

const makeFakeSurvey = (): AddSurveyModel => {
  return {
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      }
    ]
  }
}

interface SutTypes {
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
  test('should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const survey = makeFakeSurvey()
    await sut.add(survey)
    expect(addSpy).toHaveBeenCalledWith(survey)
  })

  test('should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const error = new ServerError()
    jest.spyOn(addSurveyRepositoryStub, 'add').mockRejectedValueOnce(error)

    const promise = sut.add(makeFakeSurvey())
    await expect(promise).rejects.toThrow()
  })
})
