import {
  Encrypter,
  HashComparer,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository
} from '@data/protocols'
import { DbAuthentication } from '@data/usecases'
import { Authentication, AuthenticationModel } from '@domain/usecases'
import { InvalidParamError, ServerError } from '@presentation/errors'
import {
  EncrypterStub,
  HashCompareStub,
  LoadAccountByEmailRepositoryStub,
  UpdateAccessTokenRepositoryStub
} from '../mocks'

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})
interface SutTypes {
  sut: Authentication
  hashCompareStub: HashComparer
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub =
    new LoadAccountByEmailRepositoryStub()
  const hashCompareStub = new HashCompareStub()
  const updateAccessTokenRepositoryStub = new UpdateAccessTokenRepositoryStub()
  const encrypterStub = new EncrypterStub()

  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  )

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  }
}

describe('DbAuthentication usecase', () => {
  test('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    const authenticationRequest = makeFakeAuthentication()
    await sut.auth(authenticationRequest)
    expect(loadSpy).toHaveBeenCalledWith(authenticationRequest.email)
  })

  test('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const error = new InvalidParamError('any_field')
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockRejectedValueOnce(error)
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  test('should return null LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
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

  test('should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut()
    const generateSpy = jest.spyOn(encrypterStub, 'encrypt')

    const authenticationRequest = makeFakeAuthentication()
    await sut.auth(authenticationRequest)
    expect(generateSpy).toHaveBeenCalledWith('valid_id')
  })

  test('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    const error = new ServerError()
    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(error)
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  test('should return accessToken on success', async () => {
    const { sut } = makeSut()

    const authenticationRequest = makeFakeAuthentication()
    const accessToken = await sut.auth(authenticationRequest)
    expect(accessToken).toBe('valid_token')
  })

  test('should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(
      updateAccessTokenRepositoryStub,
      'updateAccessToken'
    )

    const authenticationRequest = makeFakeAuthentication()
    await sut.auth(authenticationRequest)
    expect(updateSpy).toHaveBeenCalledWith('valid_id', 'valid_token')
  })

  test('should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const error = new ServerError()
    jest
      .spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
      .mockRejectedValueOnce(error)
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })
})
