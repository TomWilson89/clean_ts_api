import { AddSurveyController } from '@presentation/controller'
import { MissingParamError } from '@presentation/errors'
import { badRequest, noContent, serverError } from '@presentation/helpers'
import { Controller, HttpRequest } from '@presentation/protocols'
import faker from 'faker'
import MockDate from 'mockdate'
import { AddSurveySpy, ValidationSpy } from './mocks'

type SutTypes = {
  sut: Controller
  validationSpy: ValidationSpy
  addSurveySpy: AddSurveySpy
}

const mockRequest = (): HttpRequest => {
  return {
    body: {
      question: faker.random.words(),
      answers: [
        {
          image: faker.internet.url(),
          answer: faker.random.words()
        },

        {
          answer: faker.random.words()
        }
      ],
      date: new Date()
    }
  }
}
const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const addSurveySpy = new AddSurveySpy()
  const sut = new AddSurveyController(validationSpy, addSurveySpy)

  return {
    sut,
    validationSpy,
    addSurveySpy
  }
}

describe('AddSurveyController', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call validation with corect values', async () => {
    const { sut, validationSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(validationSpy.input).toEqual(request.body)
  })

  test('should return 400 if Validation returns an error', async () => {
    const { sut, validationSpy } = makeSut()
    const error = new MissingParamError('any_filed')
    jest.spyOn(validationSpy, 'validate').mockReturnValueOnce(error)
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(error))
  })

  test('should call AddSurvey with correct values', async () => {
    const { sut, addSurveySpy } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(addSurveySpy.params).toEqual(httpRequest.body)
  })

  test('should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveySpy } = makeSut()
    jest.spyOn(addSurveySpy, 'add').mockRejectedValueOnce(new Error())
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(noContent())
  })
})
