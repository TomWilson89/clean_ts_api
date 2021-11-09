import jwt from 'jsonwebtoken'
import { Encrypter } from '../../../src/data/protocols'
import { JwtAdapter } from '../../../src/infra'

jest.mock('jsonwebtoken')

interface SutTYpes {
  sut: Encrypter
}

const makeSut = (secret = 'secret'): SutTYpes => {
  const sut = new JwtAdapter(secret)

  return {
    sut
  }
}

describe('JwtAdapter', () => {
  test('should call sign with correct values', async () => {
    const { sut } = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    const id = 'any_id'
    await sut.encrypt(id)
    expect(signSpy).toHaveBeenCalledWith({ id }, 'secret')
  })
})
