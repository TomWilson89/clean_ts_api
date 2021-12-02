import { mockAddAccountParams } from '@/tests/domain/mocks'
import { DbAddAccount } from '@data/usecases'
import { InvalidParamError, ServerError } from '@presentation/errors'
import {
  AddAccountRepositorySpy,
  CheckAccountByEmailRepositorySpy,
  HasherSpy
} from '../mocks'

type SutTypes = {
  sut: DbAddAccount
  hasherSpy: HasherSpy
  addAccountRepositorySpy: AddAccountRepositorySpy
  checkAccountByEmailRepositorySpy: CheckAccountByEmailRepositorySpy
}

const makeSut = (): SutTypes => {
  const hasherSpy = new HasherSpy()
  const addAccountRepositorySpy = new AddAccountRepositorySpy()
  const checkAccountByEmailRepositorySpy =
    new CheckAccountByEmailRepositorySpy()

  const sut = new DbAddAccount(
    hasherSpy,
    addAccountRepositorySpy,
    checkAccountByEmailRepositorySpy
  )

  return {
    sut,
    hasherSpy,
    addAccountRepositorySpy,
    checkAccountByEmailRepositorySpy
  }
}

describe('DbAddAccount usecase', () => {
  test('should call CheckAccountByEmailRepository with correct email', async () => {
    const { sut, checkAccountByEmailRepositorySpy } = makeSut()

    const accountParams = mockAddAccountParams()
    await sut.add(accountParams)
    expect(checkAccountByEmailRepositorySpy.email).toBe(accountParams.email)
  })

  test('should throw if CheckAccountByEmailRepository throws', async () => {
    const { sut, checkAccountByEmailRepositorySpy } = makeSut()
    const error = new InvalidParamError('any_field')
    jest
      .spyOn(checkAccountByEmailRepositorySpy, 'checkByEmail')
      .mockRejectedValueOnce(error)

    const accountParams = mockAddAccountParams()
    const promise = sut.add(accountParams)
    await expect(promise).rejects.toThrow()
  })

  test('should return false if CheckAccountByEmailRepository returns an account', async () => {
    const { sut, checkAccountByEmailRepositorySpy } = makeSut()
    checkAccountByEmailRepositorySpy.result = true

    const accountParams = mockAddAccountParams()
    const isValid = await sut.add(accountParams)
    expect(isValid).toBe(false)
  })

  test('should call Hasher with correct password ', async () => {
    const { sut, hasherSpy } = makeSut()
    const accountParams = mockAddAccountParams()
    await sut.add(accountParams)

    expect(hasherSpy.plainText).toBe(accountParams.password)
  })

  test('should throw if Hasher throws ', async () => {
    const { sut, hasherSpy } = makeSut()
    jest.spyOn(hasherSpy, 'hash').mockRejectedValueOnce(new ServerError())
    const accountParams = mockAddAccountParams()
    const promise = sut.add(accountParams)

    await expect(promise).rejects.toThrow()
  })

  test('should call AddAccountRepository with correct values ', async () => {
    const { sut, addAccountRepositorySpy, hasherSpy } = makeSut()
    const accountParams = mockAddAccountParams()

    await sut.add(accountParams)

    expect(addAccountRepositorySpy.accountParams).toEqual({
      ...accountParams,
      password: hasherSpy.cipherText
    })
  })

  test('should throw if AddAccountRepository throws ', async () => {
    const { sut, addAccountRepositorySpy } = makeSut()
    jest
      .spyOn(addAccountRepositorySpy, 'add')
      .mockRejectedValueOnce(new ServerError())
    const accountParams = mockAddAccountParams()

    const promise = sut.add(accountParams)

    await expect(promise).rejects.toThrow()
  })

  test('should return true on success ', async () => {
    const { sut } = makeSut()

    const accountParams = mockAddAccountParams()
    const isValid = await sut.add(accountParams)

    expect(isValid).toBe(true)
  })
})
