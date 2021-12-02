import { DbCheckSurveyById } from '@data/usecases'
import { CheckSurveysById } from '@domain/usecases'
import faker from 'faker'
import { CheckSurveyByIdRepositorySpy } from '../mocks'

type SutTypes = {
  sut: CheckSurveysById
  checkSurveyByIdRepositorySpy: CheckSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const checkSurveyByIdRepositorySpy = new CheckSurveyByIdRepositorySpy()
  const sut = new DbCheckSurveyById(checkSurveyByIdRepositorySpy)

  return {
    sut,
    checkSurveyByIdRepositorySpy
  }
}
describe('DbLoadSurveyById', () => {
  test('should CheckSurveyByIdRepository with correct values', async () => {
    const { checkSurveyByIdRepositorySpy, sut } = makeSut()

    const surveyId = faker.datatype.uuid()
    await sut.checkById(surveyId)
    expect(checkSurveyByIdRepositorySpy.id).toBe(surveyId)
  })

  test('should return a true CheckSurveyByIdRepository returns true', async () => {
    const { sut } = makeSut()
    const exists = await sut.checkById(faker.datatype.uuid())
    expect(exists).toBe(true)
  })

  test('should return a false CheckSurveyByIdRepository returns false', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = makeSut()

    checkSurveyByIdRepositorySpy.result = false
    const exists = await sut.checkById(faker.datatype.uuid())
    expect(exists).toBe(false)
  })

  test('should throw is CheckSurveyByIdRepository throws', async () => {
    const { checkSurveyByIdRepositorySpy, sut } = makeSut()
    jest
      .spyOn(checkSurveyByIdRepositorySpy, 'checkById')
      .mockRejectedValueOnce(new Error())

    const promise = sut.checkById(faker.datatype.uuid())
    await expect(promise).rejects.toThrow()
  })
})
