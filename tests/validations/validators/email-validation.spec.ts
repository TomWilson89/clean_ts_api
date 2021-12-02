import { SignUpController } from '@presentation/controller'
import { InvalidParamError } from '@presentation/errors'
import { EmailValidation } from '@validations/validators'
import faker from 'faker'
import { EmailValidatorSpy } from '../../presentation/mocks'

const makeRequest = (): SignUpController.Request => {
  const password = faker.internet.password()
  return {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password,
    passwordConfirmation: password
  }
}

type SutTypes = {
  sut: EmailValidation
  emailValidatorSpy: EmailValidatorSpy
}

const makeSut = (): SutTypes => {
  const emailValidatorSpy = new EmailValidatorSpy()
  const sut = new EmailValidation('email', emailValidatorSpy)

  return {
    sut,
    emailValidatorSpy
  }
}

describe('EmailValidation', () => {
  test('should return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorSpy } = makeSut()
    emailValidatorSpy.result = false
    const error = sut.validate(makeRequest())
    expect(error).toEqual(new InvalidParamError('email'))
  })

  test('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    const request = makeRequest()

    await sut.validate({ email: request.email })
    expect(emailValidatorSpy.email).toBe(request.email)
  })

  test('should throw EmailValidator throws', async () => {
    const { emailValidatorSpy, sut } = makeSut()
    jest.spyOn(emailValidatorSpy, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    expect(sut.validate).toThrow()
  })
})
