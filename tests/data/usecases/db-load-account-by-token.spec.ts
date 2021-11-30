import { DbLoadAccountByToken } from '@data/usecases'
import { LoadAccountByToken } from '@domain/usecases'
import faker from 'faker'
import { DecryypterSpy, LoadAccountByTokenRepositorySpy } from '../mocks'
type SutTypes = {
  sut: LoadAccountByToken
  decrypterSpy: DecryypterSpy
  loadAccountByTokenRepositorySpy: LoadAccountByTokenRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadAccountByTokenRepositorySpy = new LoadAccountByTokenRepositorySpy()
  const decrypterSpy = new DecryypterSpy()
  const sut = new DbLoadAccountByToken(
    decrypterSpy,
    loadAccountByTokenRepositorySpy
  )

  return {
    sut,
    decrypterSpy,
    loadAccountByTokenRepositorySpy
  }
}
describe('DbLoadAccountByToken Usecase', () => {
  test('should call Decrypter with correct values', async () => {
    const { sut, decrypterSpy } = makeSut()
    const accessToken = faker.datatype.uuid()
    await sut.load(accessToken)
    expect(decrypterSpy.plainText).toBe(accessToken)
  })

  test('should return null if Decrypter returns null', async () => {
    const { decrypterSpy, sut } = makeSut()
    decrypterSpy.cipherText = null
    const account = await sut.load(faker.datatype.uuid(), faker.random.word())
    expect(account).toBeNull()
  })

  test('should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut()
    const accessToken = faker.datatype.uuid()
    const role = faker.random.word()
    await sut.load(accessToken, role)
    expect(loadAccountByTokenRepositorySpy.role).toBe(role)
    expect(loadAccountByTokenRepositorySpy.accessToken).toBe(accessToken)
  })

  test('should return null if LoadAccountByTokenRepository returns null', async () => {
    const { loadAccountByTokenRepositorySpy, sut } = makeSut()
    loadAccountByTokenRepositorySpy.result = null
    const account = await sut.load(faker.datatype.uuid(), faker.random.word())
    expect(account).toBeNull()
  })

  test('should return an account on success', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut()
    const account = await sut.load(faker.datatype.uuid(), faker.random.word())
    expect(account).toEqual(loadAccountByTokenRepositorySpy.result)
  })

  test('should throw if Decrypter throws ', async () => {
    const { sut, decrypterSpy } = makeSut()
    jest.spyOn(decrypterSpy, 'decrypt').mockRejectedValueOnce(new Error())

    const promise = sut.load('any_token', 'any_role')

    await expect(promise).rejects.toThrow()
  })

  test('should throw if LoadAccountByTokenRepository throws ', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut()
    jest
      .spyOn(loadAccountByTokenRepositorySpy, 'loadByToken')
      .mockRejectedValueOnce(new Error())

    const promise = sut.load('any_token', 'any_role')

    await expect(promise).rejects.toThrow()
  })
})
