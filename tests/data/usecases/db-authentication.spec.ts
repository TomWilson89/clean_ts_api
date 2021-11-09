import {
  HashedComparer,
  LoadAccountByEmailRepository
} from '../../../src/data/protocols'
import { DbAuthentication } from '../../../src/data/usecases'
import {
  Authentication,
  AuthenticationModel
} from '../../../src/domain/usecases'
import { InvalidParamError } from '../../../src/presentation/errors'
import { HashedCompareStub, LoadAccountByEmailRepositoryStub } from '../mocks'

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})
interface SutTypes {
  sut: Authentication
  hashCompareStub: HashedComparer
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub =
    new LoadAccountByEmailRepositoryStub()
  const hashCompareStub = new HashedCompareStub()

  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashCompareStub
  )

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompareStub
  }
}

describe('DbAuthentication usecase', () => {
  test('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    const authenticationRequest = makeFakeAuthentication()
    await sut.auth(authenticationRequest)
    expect(loadSpy).toHaveBeenCalledWith(authenticationRequest.email)
  })

  test('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const error = new InvalidParamError('any_field')
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockRejectedValueOnce(error)
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  test('should return null LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockReturnValueOnce(null)

    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBeNull()
  })

  test('should call HashCompare with correct values', async () => {
    const { sut, hashCompareStub } = makeSut()
    const compareSpy = jest.spyOn(hashCompareStub, 'compare')

    const authenticationRequest = makeFakeAuthentication()
    await sut.auth(authenticationRequest)
    expect(compareSpy).toHaveBeenCalledWith(
      authenticationRequest.password,
      'hashed_password'
    )
  })
})
