import {
  HashedComparer,
  LoadAccountByEmailRepository,
  TokenGenerator
} from '../../../src/data/protocols'
import { DbAuthentication } from '../../../src/data/usecases'
import {
  Authentication,
  AuthenticationModel
} from '../../../src/domain/usecases'
import {
  InvalidParamError,
  ServerError
} from '../../../src/presentation/errors'
import {
  HashedCompareStub,
  LoadAccountByEmailRepositoryStub,
  TokenGeneratorStub
} from '../mocks'

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})
interface SutTypes {
  sut: Authentication
  hashCompareStub: HashedComparer
  tokenGeneratorStub: TokenGenerator
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub =
    new LoadAccountByEmailRepositoryStub()
  const hashCompareStub = new HashedCompareStub()
  const tokenGeneratorStub = new TokenGeneratorStub()

  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    tokenGeneratorStub
  )

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    tokenGeneratorStub
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

  test('should throw if HashCompare throws', async () => {
    const { sut, hashCompareStub } = makeSut()
    const error = new ServerError()
    jest.spyOn(hashCompareStub, 'compare').mockRejectedValueOnce(error)
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  test('should return null HashCompare returns false', async () => {
    const { sut, hashCompareStub } = makeSut()
    jest
      .spyOn(hashCompareStub, 'compare')
      .mockReturnValueOnce(Promise.resolve(false))

    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBeNull()
  })

  test('should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')

    const authenticationRequest = makeFakeAuthentication()
    await sut.auth(authenticationRequest)
    expect(generateSpy).toHaveBeenCalledWith('valid_id')
  })

  test('should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const error = new ServerError()
    jest.spyOn(tokenGeneratorStub, 'generate').mockRejectedValueOnce(error)
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  test('should return accessToken on success', async () => {
    const { sut } = makeSut()

    const authenticationRequest = makeFakeAuthentication()
    const accessToken = await sut.auth(authenticationRequest)
    expect(accessToken).toBe('any_token')
  })
})
