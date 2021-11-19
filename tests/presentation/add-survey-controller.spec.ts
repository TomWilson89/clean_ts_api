import { AddSurveyController } from '../../src/presentation/controller'
import { MissingParamError } from '../../src/presentation/errors'
import { badRequest } from '../../src/presentation/helpers'
import { ValidationStub } from './mocks'
import { Controller, HttpRequest, Validation } from './protocols'
interface SutTypes {
  sut: Controller
  validationStub: Validation
}

const makeHttpRequest = (): HttpRequest => {
  return {
    body: {
      question: 'any_question',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer'
        },

        {
          answer: 'any_answer'
        }
      ]
    }
  }
}
const makeSut = (): SutTypes => {
  const validationStub = new ValidationStub()
  const sut = new AddSurveyController(validationStub)

  return {
    sut,
    validationStub
  }
}

describe('AddSurveyController', () => {
  test('should call validation with corect values', async () => {
    const { sut, validationStub } = makeSut()
    const validationSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(makeHttpRequest())
    expect(validationSpy).toHaveBeenCalledWith(makeHttpRequest().body)
  })

  test('should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    const error = new MissingParamError('any_filed')
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(error)
    const httpRequest = makeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(error))
  })
})
