import { mockAccountModel, mockAddAccountParams } from '@/tests/domain/mocks'
import {
  AddAccountRepository,
  Hasher,
  LoadAccountByEmailRepository
} from '@data/protocols'
import { DbAddAccount } from '@data/usecases'
import { InvalidParamError, ServerError } from '@presentation/errors'
import {
  AddAccountRepositoryStub,
  HasherStub,
  LoadAccountByEmailRepositoryStub
} from '../mocks'

type SutTypes = {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (loadByEmailValue = null): SutTypes => {
  const hasherStub = new HasherStub()
  const addAccountRepositoryStub = new AddAccountRepositoryStub()
  const loadAccountByEmailRepositoryStub =
    new LoadAccountByEmailRepositoryStub()

  jest
    .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    .mockReturnValue(loadByEmailValue)

  const sut = new DbAddAccount(
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  )

  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  }
}

describe.only('DbAddAccount usecase', () => {
  test('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    const accountParams = mockAddAccountParams()
    await sut.add(accountParams)
    expect(loadSpy).toHaveBeenCalledWith(accountParams.email)
  })

  test('should throw if LoadAccountByEmailRepository throws', async () => {
    const existingAccount = mockAccountModel()
    const { sut, loadAccountByEmailRepositoryStub } = makeSut(existingAccount)
    const error = new InvalidParamError('any_field')
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockRejectedValueOnce(error)

    const accountParams = mockAddAccountParams()
    const promise = sut.add(accountParams)
    await expect(promise).rejects.toThrow()
  })

  test('should return null if LoadAccountByEmailRepository returns an account', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const existingAccount = mockAccountModel()

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(Promise.resolve(existingAccount))

    const accountParams = mockAddAccountParams()
    const accessToken = await sut.add(accountParams)
    expect(accessToken).toBeNull()
  })

  test('should call Hasher with correct password ', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    const accountParams = mockAddAccountParams()
    await sut.add(accountParams)

    expect(hashSpy).toHaveBeenCalledWith(accountParams.password)
  })

  test('should throw if Hasher throws ', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockRejectedValueOnce(new ServerError())
    const accountParams = mockAddAccountParams()
    const promise = sut.add(accountParams)

    await expect(promise).rejects.toThrow()
  })

  test('should AddAccountRepository with correct values ', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountParams = mockAddAccountParams()

    await sut.add(accountParams)

    expect(addSpy).toHaveBeenCalledWith({
      name: accountParams.name,
      email: accountParams.email,
      password: 'hashed_password'
    })
  })

  test('should throw if AddAccountRepository throws ', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest
      .spyOn(addAccountRepositoryStub, 'add')
      .mockRejectedValueOnce(new ServerError())
    const accountParams = mockAddAccountParams()

    const promise = sut.add(accountParams)

    await expect(promise).rejects.toThrow()
  })

  test('should return an account on success ', async () => {
    const { sut } = makeSut()

    const accountParams = mockAddAccountParams()
    const account = await sut.add(accountParams)

    expect(account).toEqual(mockAccountModel())
  })
})
