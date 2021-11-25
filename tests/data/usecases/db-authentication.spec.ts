import { mockAuthenticationParams } from '@/tests/domain/mocks'
import {
  Encrypter,
  HashComparer,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository
} from '@data/protocols'
import { DbAuthentication } from '@data/usecases'
import { Authentication } from '@domain/usecases'
import { InvalidParamError, ServerError } from '@presentation/errors'
import {
  EncrypterStub,
  HashCompareStub,
  LoadAccountByEmailRepositoryStub,
  UpdateAccessTokenRepositoryStub
} from '../mocks'

type SutTypes = {
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
    const authenticationParams = mockAuthenticationParams()
    await sut.auth(authenticationParams)
    expect(loadSpy).toHaveBeenCalledWith(authenticationParams.email)
  })

  test('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const error = new InvalidParamError('any_field')
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockRejectedValueOnce(error)
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })

  test('should return null LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(null)

    const accessToken = await sut.auth(mockAuthenticationParams())
    expect(accessToken).toBeNull()
  })

  test('should call HashCompare with correct values', async () => {
    const { sut, hashCompareStub } = makeSut()
    const compareSpy = jest.spyOn(hashCompareStub, 'compare')

    const authenticationParams = mockAuthenticationParams()
    await sut.auth(authenticationParams)
    expect(compareSpy).toHaveBeenCalledWith(
      authenticationParams.password,
      'hashed_password'
    )
  })

  test('should throw if HashCompare throws', async () => {
    const { sut, hashCompareStub } = makeSut()
    const error = new ServerError()
    jest.spyOn(hashCompareStub, 'compare').mockRejectedValueOnce(error)
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })

  test('should return null HashCompare returns false', async () => {
    const { sut, hashCompareStub } = makeSut()
    jest
      .spyOn(hashCompareStub, 'compare')
      .mockReturnValueOnce(Promise.resolve(false))

    const accessToken = await sut.auth(mockAuthenticationParams())
    expect(accessToken).toBeNull()
  })

  test('should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut()
    const generateSpy = jest.spyOn(encrypterStub, 'encrypt')

    const authenticationParams = mockAuthenticationParams()
    await sut.auth(authenticationParams)
    expect(generateSpy).toHaveBeenCalledWith('any_id')
  })

  test('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    const error = new ServerError()
    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(error)
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })

  test('should return accessToken on success', async () => {
    const { sut } = makeSut()

    const authenticationParams = mockAuthenticationParams()
    const accessToken = await sut.auth(authenticationParams)
    expect(accessToken).toBe('valid_token')
  })

  test('should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(
      updateAccessTokenRepositoryStub,
      'updateAccessToken'
    )

    const authenticationParams = mockAuthenticationParams()
    await sut.auth(authenticationParams)
    expect(updateSpy).toHaveBeenCalledWith('any_id', 'valid_token')
  })

  test('should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const error = new ServerError()
    jest
      .spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
      .mockRejectedValueOnce(error)
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })
})
