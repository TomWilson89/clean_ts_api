import { mockAuthenticationParams } from '@/tests/domain/mocks'
import { DbAuthentication } from '@data/usecases'
import { Authentication } from '@domain/usecases'
import { InvalidParamError, ServerError } from '@presentation/errors'
import {
  EncrypterSpy,
  HashCompareSpy,
  LoadAccountByEmailRepositorySpy,
  UpdateAccessTokenRepositorySpy
} from '../mocks'

type SutTypes = {
  sut: Authentication
  hashCompareSpy: HashCompareSpy
  encrypterSpy: EncrypterSpy
  updateAccessTokenRepositorySpy: UpdateAccessTokenRepositorySpy
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy()
  const hashCompareSpy = new HashCompareSpy()
  const updateAccessTokenRepositorySpy = new UpdateAccessTokenRepositorySpy()
  const encrypterSpy = new EncrypterSpy()

  const sut = new DbAuthentication(
    loadAccountByEmailRepositorySpy,
    hashCompareSpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy
  )

  return {
    sut,
    loadAccountByEmailRepositorySpy,
    hashCompareSpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy
  }
}

describe('DbAuthentication usecase', () => {
  test('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail')
    const authenticationParams = mockAuthenticationParams()
    await sut.auth(authenticationParams)
    expect(loadSpy).toHaveBeenCalledWith(authenticationParams.email)
  })

  test('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    const error = new InvalidParamError('any_field')
    jest
      .spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail')
      .mockRejectedValueOnce(error)

    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })

  test('should return null LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    loadAccountByEmailRepositorySpy.result = null

    const accessToken = await sut.auth(mockAuthenticationParams())
    expect(accessToken).toBeNull()
  })

  test('should call HashCompare with correct values', async () => {
    const { sut, hashCompareSpy, loadAccountByEmailRepositorySpy } = makeSut()

    const authenticationParams = mockAuthenticationParams()
    await sut.auth(authenticationParams)
    expect(hashCompareSpy.plainPassword).toBe(authenticationParams.password)
    expect(hashCompareSpy.hash).toBe(
      loadAccountByEmailRepositorySpy.result.password
    )
  })

  test('should throw if HashCompare throws', async () => {
    const { sut, hashCompareSpy } = makeSut()
    const error = new ServerError()
    jest.spyOn(hashCompareSpy, 'compare').mockRejectedValueOnce(error)
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })

  test('should return null HashCompare returns false', async () => {
    const { sut, hashCompareSpy } = makeSut()
    hashCompareSpy.result = false

    const accessToken = await sut.auth(mockAuthenticationParams())
    expect(accessToken).toBeNull()
  })

  test('should call Encrypter with correct id', async () => {
    const { sut, encrypterSpy, loadAccountByEmailRepositorySpy } = makeSut()

    const authenticationParams = mockAuthenticationParams()
    await sut.auth(authenticationParams)
    expect(encrypterSpy.plainText).toBe(
      loadAccountByEmailRepositorySpy.result.id
    )
  })

  test('should throw if Encrypter throws', async () => {
    const { sut, encrypterSpy } = makeSut()
    const error = new ServerError()
    jest.spyOn(encrypterSpy, 'encrypt').mockRejectedValueOnce(error)
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })

  test('should return accessToken on success', async () => {
    const { sut, encrypterSpy } = makeSut()

    const accessToken = await sut.auth(mockAuthenticationParams())
    expect(accessToken).toBe(encrypterSpy.cipherValue)
  })

  test('should call UpdateAccessTokenRepository with correct values', async () => {
    const {
      sut,
      updateAccessTokenRepositorySpy,
      encrypterSpy,
      loadAccountByEmailRepositorySpy
    } = makeSut()

    const authenticationParams = mockAuthenticationParams()
    await sut.auth(authenticationParams)
    expect(updateAccessTokenRepositorySpy.id).toBe(
      loadAccountByEmailRepositorySpy.result.id
    )
    expect(updateAccessTokenRepositorySpy.token).toBe(encrypterSpy.cipherValue)
  })

  test('should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositorySpy } = makeSut()
    const error = new ServerError()
    jest
      .spyOn(updateAccessTokenRepositorySpy, 'updateAccessToken')
      .mockRejectedValueOnce(error)
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })
})
