import { Decrypter } from '../../../src/data/protocols'
import { DbLoadAccountByToken } from '../../../src/data/usecases'
import { LoadAccountByToken } from '../../../src/domain/usecases'
import { DecryypterStub } from '../mocks'

interface SutTypes {
  sut: LoadAccountByToken
  decrypterStub: Decrypter
}

const makeSut = (): SutTypes => {
  const decrypterStub = new DecryypterStub()
  const sut = new DbLoadAccountByToken(decrypterStub)

  return {
    sut,
    decrypterStub
  }
}
describe('DbLoadAccountByToken Usecase', () => {
  test('should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    const accessToken = 'any_token'
    await sut.load(accessToken)
    expect(decryptSpy).toHaveBeenCalledWith(accessToken)
  })

  test('should return null if Decrypter returns null', async () => {
    const { decrypterStub, sut } = makeSut()
    jest
      .spyOn(decrypterStub, 'decrypt')
      .mockReturnValueOnce(Promise.resolve(null))
    const account = await sut.load('any_token', 'any_role')
    expect(account).toBeNull()
  })
})
