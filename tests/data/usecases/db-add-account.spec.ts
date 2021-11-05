import { Encrypter } from '@/data/protocols'
import { DbAddAccount } from '@/data/usecases'
import { ServerError } from '@/presentation/errors'
import { EncrypterStub } from '../mocks'

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
}

const makeSut = (): SutTypes => {
  const encrypterStub = new EncrypterStub()
  const sut = new DbAddAccount(encrypterStub)

  return {
    sut,
    encrypterStub
  }
}

describe('DbAddAccount usecase', () => {
  test('should call Encrypted with correct password ', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    await sut.add(accountData)

    expect(encryptSpy).toHaveBeenCalledWith(accountData.password)
  })

  test('should throw if Encrypter throws ', async () => {
    const { sut, encrypterStub } = makeSut()
    jest
      .spyOn(encrypterStub, 'encrypt')
      .mockRejectedValueOnce(new ServerError())
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    const promise = sut.add(accountData)

    await expect(promise).rejects.toThrow()
  })
})
