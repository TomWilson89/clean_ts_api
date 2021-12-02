import { mockAddAccountParams } from '@/tests/domain/mocks'
import { DbAddAccount } from '@data/usecases'
import { InvalidParamError, ServerError } from '@presentation/errors'
import faker from 'faker'
import {
  AddAccountRepositorySpy,
  HasherSpy,
  LoadAccountByEmailRepositorySpy
} from '../mocks'

type SutTypes = {
  sut: DbAddAccount
  hasherSpy: HasherSpy
  addAccountRepositorySpy: AddAccountRepositorySpy
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy
}

const makeSut = (): SutTypes => {
  const hasherSpy = new HasherSpy()
  const addAccountRepositorySpy = new AddAccountRepositorySpy()
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy()

  loadAccountByEmailRepositorySpy.result = null

  const sut = new DbAddAccount(
    hasherSpy,
    addAccountRepositorySpy,
    loadAccountByEmailRepositorySpy
  )

  return {
    sut,
    hasherSpy,
    addAccountRepositorySpy,
    loadAccountByEmailRepositorySpy
  }
}

describe('DbAddAccount usecase', () => {
  test('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()

    const accountParams = mockAddAccountParams()
    await sut.add(accountParams)
    expect(loadAccountByEmailRepositorySpy.email).toBe(accountParams.email)
  })

  test('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    const error = new InvalidParamError('any_field')
    jest
      .spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail')
      .mockRejectedValueOnce(error)

    const accountParams = mockAddAccountParams()
    const promise = sut.add(accountParams)
    await expect(promise).rejects.toThrow()
  })

  test('should return false if LoadAccountByEmailRepository returns an account', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    loadAccountByEmailRepositorySpy.result = {
      id: faker.datatype.uuid(),
      name: faker.name.findName(),
      password: faker.internet.password()
    }

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
