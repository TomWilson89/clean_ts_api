import { AddSurveyController } from '../../src/presentation/controller'
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
})
