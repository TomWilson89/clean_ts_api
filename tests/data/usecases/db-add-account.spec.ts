import {
  AddAccountRepository,
  Hasher,
  LoadAccountByEmailRepository
} from '../../../src/data/protocols'
import { DbAddAccount } from '../../../src/data/usecases'
import { AccountModel } from '../../../src/domain/models'
import { AddAccountModel } from '../../../src/domain/usecases'
import { ServerError } from '../../../src/presentation/errors'
import {
  AddAccountRepositoryStub,
  HasherStub,
  LoadAccountByEmailRepositoryStub
} from '../mocks'

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password'
})

const makeFakeAccountData = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})
interface SutTypes {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = new HasherStub()
  const addAccountRepositoryStub = new AddAccountRepositoryStub()
  const loadAccountByEmailRepositoryStub =
    new LoadAccountByEmailRepositoryStub()
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

describe('DbAddAccount usecase', () => {
  test('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    const accountData = makeFakeAccountData()
    await sut.add(accountData)
    expect(loadSpy).toHaveBeenCalledWith(accountData.email)
  })

  test('should call Hasher with correct password ', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    const accountData = makeFakeAccountData()
    await sut.add(accountData)

    expect(hashSpy).toHaveBeenCalledWith(accountData.password)
  })

  test('should throw if Hasher throws ', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockRejectedValueOnce(new ServerError())
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    const promise = sut.add(accountData)

    await expect(promise).rejects.toThrow()
  })

  test('should AddAccountRepository with correct values ', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData = makeFakeAccountData()

    await sut.add(accountData)

    expect(addSpy).toHaveBeenCalledWith({
      name: accountData.name,
      email: accountData.email,
      password: 'hashed_password'
    })
  })

  test('should throw if AddAccountRepository throws ', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest
      .spyOn(addAccountRepositoryStub, 'add')
      .mockRejectedValueOnce(new ServerError())
    const accountData = makeFakeAccountData()

    const promise = sut.add(accountData)

    await expect(promise).rejects.toThrow()
  })

  test('should return an account on success ', async () => {
    const { sut } = makeSut()

    const accountData = makeFakeAccountData()
    const account = await sut.add(accountData)

    expect(account).toEqual(makeFakeAccount())
  })
})
